"use server";

import { formatError, prismaToJs } from "../utils";
import { CONSTANTS } from "../constants";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { validProduct } from "./_helper/constant";

// latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: CONSTANTS.LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      ...validProduct,
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
  try {
    const data = await prisma.product.findUnique({
      where: {
        slug,
        ...validProduct,
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
    if (!data) {
      return formatError("Product not found");
    }
    return { success: true, data: prismaToJs(data) };
  } catch (err) {
    return formatError(err);
  }
};

// get-all-products
export async function getAllProducts({
  query = "",
  category,
  page = 1,
  price,
  rating,
  sort,
  limit,
}: {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  rating?: string;
  sort?: string;
  price?: string;
}) {
  const queryFilter: Prisma.ProductWhereInput = {
    name: {
      contains: query,
      mode: "insensitive",
    } as Prisma.StringFilter,
  };
  const categoryFilter =
    category && category !== CONSTANTS.ALL ? { category } : {};
  const [minPrice, maxPrice] = price ? price.split("-") : [];
  const priceFilter =
    price && price !== CONSTANTS.ALL
      ? { price: { gte: minPrice, lte: maxPrice } }
      : {};
  const ratingFilter =
    rating && rating !== CONSTANTS.ALL ? { rating: { gte: rating } } : {};
  const sortFilter: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    lowest: { price: "asc" },
    highest: { price: "desc" },
    rating: { rating: "desc" },
    default: { createdAt: "desc" },
  };

  const pagination = limit ? { skip: (page - 1) * limit } : {};

  const product = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...validProduct,
    },
    include: {
      Deal: {
        where: {
          isActive: true,
          endTime: { gte: new Date() },
        },
      },
    },
    orderBy: sort ? sortFilter[sort] : sortFilter.default,
    take: limit,
    ...pagination,
  });
  const count = await prisma.product.count();
  return {
    product: prismaToJs(product),
    count,
    totalPages: limit ? Math.ceil(count / limit) : 0,
  };
}
