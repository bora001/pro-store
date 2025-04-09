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

// get-feature-product
export const getFeatureProduct = async () => {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: {
      createdAt: "desc",
    },
    include: { Deal: true },
    take: 4,
  });
  return prismaToJs(data);
};
