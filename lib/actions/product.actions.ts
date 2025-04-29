"use server";

import { prismaToJs } from "../utils";
import { CONSTANTS, REDIS_KEY } from "../constants";
import { prisma } from "@/db/prisma";
import { cacheData, getCachedData } from "../redis/redis-handler";
import { BannerType } from "@/types";

// latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: CONSTANTS.LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Deal: {
        where: {
          isActive: true,
          endTime: { gte: new Date() },
        },
      },
    },
  });
  return prismaToJs(data);
}

// single products by slug
export const getProductBySlug = async (slug: string) => {
  const data = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      Deal: {
        where: {
          product: {
            slug,
          },
          isActive: true,
          endTime: { gte: new Date() },
        },
      },
    },
  });
  return prismaToJs(data);
};

// get-all-category
export const getAllCategory = async () => {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
  return data.map(({ category, _count }) => ({
    category,
    count: _count,
  }));
};

// get-banner
export const getBanner = async () => {
  const cachedProduct = await getCachedData(REDIS_KEY.BANNER);
  if (cachedProduct) {
    return cachedProduct as BannerType[];
  }
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      banner: true,
      name: true,
    },
    take: 4,
  });
  await cacheData(REDIS_KEY.BANNER, data, 0);
  return prismaToJs(data);
};
