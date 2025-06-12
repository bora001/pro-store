"use server";

import { prisma } from "@/db/prisma";
import { validProduct } from "../constants";
import { cacheData, getCachedData } from "@/lib/redis/redis-handler";
import { REDIS_KEY } from "@/lib/constants";
import { BannerType } from "@/types";
import { prismaToJs } from "@/lib/utils";

export const handleAllCategory = async () => {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
    where: { ...validProduct },
  });
  return { data: data.map(({ category, _count }) => ({ category, count: _count })) };
};

export const handleBanner = async () => {
  const cachedProduct = await getCachedData(REDIS_KEY.BANNER);
  if (cachedProduct) return { data: cachedProduct as BannerType[] };
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, banner: true, name: true },
    take: 4,
  });
  await cacheData(REDIS_KEY.BANNER, data, 0);
  return { data: prismaToJs(data) };
};
