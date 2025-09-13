"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS } from "@/lib/constants";
import { validProduct } from "../constants";
import { prismaToJs } from "@/lib/utils";
import { GetAlProductsQuery } from "../handler/product.actions";
import { Prisma } from "@prisma/client";

// latest products
export const handleLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: CONSTANTS.LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
    where: { ...validProduct },
    include: { Deal: { where: { isActive: true, endTime: { gte: new Date() } } } },
  });
  return { data: prismaToJs(data) };
};

// single products by slug
export const handleProductBySlug = async (slug: string) => {
  const data = await prisma.product.findUnique({
    where: { slug, price: { gte: 1 } },
    include: { Deal: { where: { product: { slug }, isActive: true, endTime: { gte: new Date() } } } },
  });
  if (!data) throw new Error("Product not found");
  return { data: prismaToJs(data) };
};

// get-all-products
export const handleAllProducts = async ({
  query = "",
  category,
  page = 1,
  price,
  rating,
  sort,
  limit,
}: GetAlProductsQuery) => {
  const queryFilter: Prisma.ProductWhereInput = {
    name: { contains: query, mode: "insensitive" } as Prisma.StringFilter,
  };
  const categoryFilter = category && category !== CONSTANTS.ALL ? { category } : {};
  const [minPrice, maxPrice] = price ? price.split("-") : [];
  const priceFilter = price && price !== CONSTANTS.ALL ? { price: { gte: minPrice, lte: maxPrice } } : {};

  const ratingFilter = rating && rating !== CONSTANTS.ALL ? { rating: { gte: rating } } : {};
  const sortFilter: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    lowest: { price: "asc" },
    highest: { price: "desc" },
    rating: { rating: "desc" },
    default: { createdAt: "desc" },
  };

  const pagination = limit ? { skip: (page - 1) * limit } : {};

  const product = await prisma.product.findMany({
    where: {
      ...validProduct,
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    include: { Deal: { where: { isActive: true, endTime: { gte: new Date() } } } },
    orderBy: sort ? sortFilter[sort] : sortFilter.default,
    take: limit,
    ...pagination,
  });
  const count = await prisma.product.count();
  return {
    data: {
      product: prismaToJs(product),
      count,
      totalPages: limit ? Math.ceil(count / limit) : 0,
    },
  };
};
