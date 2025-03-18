"use server";

import { prismaToJs } from "../utils";
import { CONSTANTS } from "../constants";
import { prisma } from "@/db/prisma";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: CONSTANTS.LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return prismaToJs(data);
}
