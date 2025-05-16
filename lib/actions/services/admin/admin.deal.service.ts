"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS, REDIS_KEY } from "@/lib/constants";
import { redis } from "@/lib/redis";
import { cacheData, deleteAllRedisKey, getCachedData } from "@/lib/redis/redis-handler";
import { prismaToJs } from "@/lib/utils";
import { addDealSchema } from "@/lib/validator";
import { AdminDealResult, CartItemType, addDealType, getDealType } from "@/types";
import { AsyncReturn } from "@/utils/handle-async";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export type FetchGetDealType = { id?: string; isActive?: boolean };

// get-deal
export const fetchGetDeal = async ({ id, isActive }: FetchGetDealType) => {
  const hasId = id ? { id } : {};
  const hasActive = isActive ? { product: { Deal: { some: { isActive: true } } } } : {};

  const data = await prisma.deal.findFirst({
    where: { ...hasId, ...hasActive },
    include: {
      product: {
        select: {
          stock: true,
          images: true,
          price: true,
          slug: true,
          id: true,
          name: true,
          Deal: { where: { isActive: true }, select: { title: true } },
        },
      },
    },
  });

  if (!data) throw new Error("Deal not found");
  return { data: prismaToJs(data) };
};

// get-all-deals-by-query
export type FetchGetAllDealsByQueryType = { page: number; limit?: number; query: string };

// get-all-deals-admin
export const fetchGetAllDealsByQuery = async ({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
  query,
}: FetchGetAllDealsByQueryType): Promise<{ data: AdminDealResult }> => {
  const queryFilter: Prisma.DealWhereInput = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { product: { name: { contains: query, mode: "insensitive" } } },
        ],
      }
    : {};
  const deal = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
    where: { ...queryFilter },
    take: limit,
    skip: (page - 1) * limit,
  });
  if (!deal) throw new Error("Deal not found");
  const count = await prisma.deal.count();
  return {
    data: {
      deal: prismaToJs(deal),
      count,
      totalPages: limit ? Math.ceil(count / limit) : 0,
    },
  };
};

// get-active-deal
export type handleGetActiveDealType = { id?: string; isActive?: boolean };
export async function handleGetActiveDeal({
  id,
  isActive,
}: handleGetActiveDealType): AsyncReturn<getDealType | addDealType | undefined> {
  const hasId = id ? { id } : {};
  const hasActive = isActive ? { product: { Deal: { some: { isActive: true } } } } : {};
  const cachedDeal: { hasDeal: boolean; data: addDealType } | null = await getCachedData(REDIS_KEY.ACTIVE_DEAL);

  if (cachedDeal !== null && !cachedDeal.hasDeal) return { data: undefined };
  if (cachedDeal) return { data: cachedDeal.data };

  const data = await prisma.deal.findFirst({
    where: { ...hasId, ...hasActive },
    include: {
      product: {
        select: {
          stock: true,
          images: true,
          price: true,
          slug: true,
          id: true,
          name: true,
          Deal: { where: { isActive: true }, select: { title: true } },
        },
      },
    },
  });

  await cacheData(REDIS_KEY.ACTIVE_DEAL, { hasDeal: !!data, data: data }, 0);
  if (!data) throw new Error("Deal not found");
  return { data: prismaToJs(data) };
}

// create-deal
export type FetchCreateDealType = z.infer<typeof addDealSchema>;
export const fetchCreateDeal = async (values: FetchCreateDealType) => {
  const data = addDealSchema.parse(values);
  if (!data.endTime) throw new Error("End time is required.");
  await prisma.deal.create({ data: { ...data, endTime: data.endTime } });
  await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
  return { message: "Deal created successfully" };
};

// update-deal
export const fetchUpdateDeal = async (data: Partial<addDealType>) => {
  if (!data.id) throw new Error("ID is undefined");
  const isOtherActive = await prisma.deal.findFirst({ where: { isActive: true } });
  if (isOtherActive && isOtherActive.id !== data.id && data.isActive) throw new Error("Active deal already exists.");

  const deals = await prisma.deal.findFirst({ where: { id: data.id } });
  if (!deals) throw new Error("Deal not found");

  if (data.isActive || (deals.isActive && !data.isActive)) {
    await redis.del(REDIS_KEY.ACTIVE_DEAL);
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
  }
  const { endTime, product: _product, ...rest } = data;
  await prisma.deal.update({
    where: { id: data.id },
    data: { ...rest, ...(endTime && { endTime }) },
  });
  await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
  return { message: "Deal updated successfully" };
};

// delete-deal
export const fetchDeleteDeal = async (id: string) => {
  const isExist = await prisma.deal.findFirst({ where: { id } });
  if (!isExist) throw new Error("Deal not found");

  await prisma.deal.delete({ where: { id } });
  await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
  return { message: "Deal deleted successfully" };
};

// deal-included
export type FetchHasIncludedDealType = { items: CartItemType[]; dealOptions?: Prisma.DealWhereInput };
export const fetchHasIncludedDeal = async ({ items, dealOptions }: FetchHasIncludedDealType) => {
  const productId = items.map((item) => item.productId);
  const deal = await prisma.deal.findMany({ where: { productId: { in: productId }, isActive: true, ...dealOptions } });
  if (!deal.length) throw new Error("Deal not found");
  return { data: prismaToJs(deal[0]) };
};
