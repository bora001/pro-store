"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS, REDIS_KEY } from "@/lib/constants";
import { Prisma } from "@prisma/client";
import { formatError, formatSuccess, prismaToJs } from "@/lib/utils";
import { AdminDealResult, CartItemType, addDealType } from "@/types";
import {
  cacheData,
  deleteAllRedisKey,
  getCachedData,
} from "@/lib/redis/redis-handler";
import { addDealSchema } from "@/lib/validator";
import { redis } from "@/lib/redis";
import { z } from "zod";

// get-deal
export async function getDeal({
  id,
  isActive,
}: {
  id?: string;
  isActive?: boolean;
}) {
  try {
    const hasId = id ? { id } : {};
    const hasActive = isActive
      ? {
          product: {
            Deal: {
              some: {
                isActive: true,
              },
            },
          },
        }
      : {};

    const data = await prisma.deal.findFirst({
      where: {
        ...hasId,
        ...hasActive,
      },
      include: {
        product: {
          select: {
            stock: true,
            images: true,
            price: true,
            slug: true,
            id: true,
            name: true,
            Deal: {
              where: {
                isActive: true,
              },
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!data) throw new Error("Deal not found");

    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return formatError(error);
  }
}

// get-all-deals-by-query
export async function getAllDealsByQuery({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
  query,
}: {
  page: number;
  limit?: number;
  query: string;
}): Promise<AdminDealResult> {
  const queryFilter: Prisma.DealWhereInput = query
    ? {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            product: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : {};
  const deal = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
    where: {
      ...queryFilter,
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  if (!deal) throw new Error("Deal not found");
  const count = await prisma.deal.count();
  return {
    deal: prismaToJs(deal),
    count,
    totalPages: limit ? Math.ceil(count / limit) : 0,
  };
}

// get-all-deals-admin
export async function getAllDeals({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: {
  page: number;
  limit?: number;
}): Promise<AdminDealResult> {
  const cacheKey = `${REDIS_KEY.ADMIN_DEAL_LIST}_${page}`;

  const cachedList = await getCachedData<AdminDealResult>(cacheKey);
  if (cachedList) {
    return { ...cachedList };
  }
  const deal = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  if (!deal) throw new Error("Deal not found");
  const count = await prisma.deal.count();
  const result = {
    deal: prismaToJs(deal),
    count,
    totalPages: limit ? Math.ceil(count / limit) : 0,
  };
  await cacheData(cacheKey, result, 0);
  return result;
}

// get-active-deal
export async function getActiveDeal({
  id,
  isActive,
}: {
  id?: string;
  isActive?: boolean;
}) {
  try {
    const hasId = id ? { id } : {};
    const hasActive = isActive
      ? {
          product: {
            Deal: {
              some: {
                isActive: true,
              },
            },
          },
        }
      : {};

    const cachedDeal: { hasDeal: boolean; data: addDealType } | null =
      await getCachedData(REDIS_KEY.ACTIVE_DEAL);

    if (cachedDeal !== null && !cachedDeal.hasDeal) {
      return { success: true, data: undefined };
    }

    if (cachedDeal) {
      return {
        success: true,
        data: cachedDeal.data,
      };
    }

    const data = await prisma.deal.findFirst({
      where: {
        ...hasId,
        ...hasActive,
      },
      include: {
        product: {
          select: {
            stock: true,
            images: true,
            price: true,
            slug: true,
            id: true,
            name: true,
            Deal: {
              where: {
                isActive: true,
              },
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    await cacheData(REDIS_KEY.ACTIVE_DEAL, { hasDeal: !!data, data: data }, 0);

    if (!data) throw new Error("Deal not found");

    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return formatError(error);
  }
}

// create-deal
export async function createDeal(values: z.infer<typeof addDealSchema>) {
  try {
    const data = addDealSchema.parse(values);
    if (!data.endTime) {
      throw new Error("End time is required.");
    }
    await prisma.deal.create({
      data: { ...data, endTime: data.endTime },
    });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    return formatSuccess("Deal created successfully");
  } catch (error) {
    return formatError(error);
  }
}

// update-deal
export async function updateDeal(data: Partial<addDealType>) {
  try {
    if (!data.id) throw new Error("ID is undefined");
    const isOtherActive = await prisma.deal.findFirst({
      where: { isActive: true },
    });
    if (isOtherActive && isOtherActive.id !== data.id && data.isActive)
      throw new Error("Active deal already exists.");
    const deals = await prisma.deal.findFirst({
      where: { id: data.id },
    });
    if (!deals) throw new Error("Deal not found");
    if (data.isActive || (deals.isActive && !data.isActive)) {
      await redis.del(REDIS_KEY.ACTIVE_DEAL);
      await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    }
    const { endTime, product: _product, ...rest } = data;
    await prisma.deal.update({
      where: { id: data.id },
      data: {
        ...rest,
        ...(endTime && { endTime }),
      },
    });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    return formatSuccess("Deal updated successfully");
  } catch (error) {
    return formatError(error);
  }
}

// delete-deal
export async function deleteDeal(id: string) {
  try {
    const isExist = await prisma.deal.findFirst({
      where: { id },
    });
    if (!isExist) throw new Error("Deal not found");
    await prisma.deal.delete({
      where: {
        id,
      },
    });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    return formatSuccess("Deal deleted successfully");
  } catch (error) {
    return formatError(error);
  }
}

// deal-included
export async function hasIncludedDeal({
  items,
  dealOptions,
}: {
  items: CartItemType[];
  dealOptions?: Prisma.DealWhereInput;
}) {
  const productId = items.map((item) => item.productId);
  try {
    const deal = await prisma.deal.findMany({
      where: {
        productId: { in: productId },
        isActive: true,
        ...dealOptions,
      },
    });
    if (!deal.length) throw new Error("Deal not found");
    return {
      success: true,
      data: prismaToJs(deal[0]),
    };
  } catch (error) {
    return formatError(error);
  }
}
