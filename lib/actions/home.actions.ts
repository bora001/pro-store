import { BannerType } from "@/types";
import { REDIS_KEY } from "../constants";
import { cacheData, getCachedData } from "../redis/redis-handler";
import { prisma } from "@/db/prisma";
import { prismaToJs } from "../utils";
import { validProduct } from "./_helper/constant";

// get-all-category
export const getAllCategory = async () => {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
    where: {
      ...validProduct,
    },
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
