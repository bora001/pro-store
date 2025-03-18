"use server";

import { prismaToJs } from "../utils";
import { CONSTANTS } from "../constants";
import { prisma } from "@/db/prisma";

// latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: CONSTANTS.LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: "desc",
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
  });
  return prismaToJs(data);
};
