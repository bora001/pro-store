"use server";

import { prisma } from "@/db/prisma";
import { REDIS_KEY } from "@/lib/constants";
import { formatError, prismaToJs } from "@/lib/utils";
import { addDealType } from "@/types";
import { cacheData, getCachedData } from "@/lib/redis/redis-handler";

import { handleAsync } from "@/utils/handle-async";
import {
  FetchCreateDealType,
  FetchGetAllDealsByQueryType,
  FetchGetDealType,
  FetchHasIncludedDealType,
  fetchCreateDeal,
  fetchDeleteDeal,
  fetchGetAllDealsByQuery,
  fetchGetDeal,
  fetchHasIncludedDeal,
  fetchUpdateDeal,
} from "../../services/admin/admin.deal.service";

// get-deal
export async function getDeal(queries: FetchGetDealType) {
  return handleAsync(() => fetchGetDeal(queries));
}
// get-all-deals-by-query
export async function getAllDealsByQuery(queries: FetchGetAllDealsByQueryType) {
  return handleAsync(() => fetchGetAllDealsByQuery(queries));
}
// get-all-deals-admin
export async function getAllDeals(queries: FetchGetAllDealsByQueryType) {
  return handleAsync(() => fetchGetAllDealsByQuery(queries));
}
// no handleAsync // get-active-deal
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
export async function createDeal(queries: FetchCreateDealType) {
  return handleAsync(() => fetchCreateDeal(queries));
}
// update-deal
export async function updateDeal(data: Partial<addDealType>) {
  return handleAsync(() => fetchUpdateDeal(data));
}
// delete-deal
export async function deleteDeal(id: string) {
  return handleAsync(() => fetchDeleteDeal(id));
}
// deal-included
export async function hasIncludedDeal(queries: FetchHasIncludedDealType) {
  return handleAsync(() => fetchHasIncludedDeal(queries));
}
