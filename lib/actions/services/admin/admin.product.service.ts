"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS, PATH, REDIS_KEY, TYPESENSE_KEY } from "@/lib/constants";
import { redis } from "@/lib/redis";
import { cacheData, deleteAllRedisKey, getCachedData } from "@/lib/redis/redis-handler";
import { createOneIndex } from "@/lib/typesense/create-one-Index";
import {
  ProductByTagSchemaIndexConvertor,
  ProductSchemaIndexConvertor,
} from "@/lib/typesense/model/index-schema-convertor";
import { updateIndex } from "@/lib/typesense/update-index";
import { prismaToJs } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { AdminProductResult, InsertProductSchemaType, TagType, UpdateProductSchemaType } from "@/types";
import { Prisma } from "@prisma/client";
import { deleteOneItemIndex } from "@/lib/typesense/delete-one-item-index";
import { revalidatePath } from "next/cache";
import { deleteImage } from "../../utils/images.utils";

// get-product
export type HandleGetProductType = { id: string; props?: Prisma.ProductFindFirstArgs };
export const handleGetProduct = async ({ id, props }: HandleGetProductType) => {
  const product = await prisma.product.findFirst({ where: { id }, ...props });
  if (!product) throw new Error("Product not found");
  return { data: prismaToJs(product) };
};

// get-all-product-admin
export type HandleGetAllAdminProductType = { page?: number; limit?: number };
export const handleGetAllAdminProduct = async ({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: HandleGetAllAdminProductType): Promise<{ data: AdminProductResult }> => {
  const cacheKey = `${REDIS_KEY.ADMIN_PRODUCT_LIST}_${page}`;
  const cachedList = await getCachedData<AdminProductResult>(cacheKey);
  if (cachedList) return { data: { ...cachedList } };

  const pagination = limit ? { skip: (page - 1) * limit } : {};
  const product = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      category: true,
      stock: true,
      rating: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...pagination,
  });
  const count = await prisma.product.count();
  const result = { product: prismaToJs(product), count, totalPages: limit ? Math.ceil(count / limit) : 0 };
  await cacheData(cacheKey, result, 0);
  return { data: result };
};

// create-product
export const handleCreateProduct = async (data: InsertProductSchemaType) => {
  const product = insertProductSchema.parse(data);
  const result = await prisma.product.create({
    data: { ...product, tags: { connect: product.tags?.map((tag: TagType) => ({ id: tag.id })) } },
  });
  if (data.isFeatured) await redis.del(REDIS_KEY.BANNER);

  // update-typesense
  const updateData = { ...product, id: result.id };
  await createOneIndex(TYPESENSE_KEY.PRODUCT, ProductSchemaIndexConvertor([updateData]));
  await createOneIndex(TYPESENSE_KEY.PRODUCT_BY_TAG, ProductByTagSchemaIndexConvertor([updateData]));
  await deleteAllRedisKey(REDIS_KEY.ADMIN_PRODUCT_LIST);
  return { message: "Product created successfully" };
};

// update-product
export const handleUpdateProduct = async (data: UpdateProductSchemaType) => {
  const originalProductData = await prisma.product.findFirst({ where: { id: data.id } });
  if (!originalProductData) throw new Error("Product not found");
  if ((originalProductData.isFeatured && !data.isFeatured) || (!originalProductData.isFeatured && data.isFeatured)) {
    await redis.del(REDIS_KEY.BANNER);
  }
  const product = updateProductSchema.parse(data);
  await prisma.product.update({
    where: { id: data.id },
    data: { ...product, tags: { set: product.tags?.map((tag) => ({ id: tag.id })) } },
  });

  // redis + typesense
  await updateIndex(TYPESENSE_KEY.PRODUCT_BY_TAG, ProductByTagSchemaIndexConvertor([product])[0], data.id!);
  await updateIndex(TYPESENSE_KEY.PRODUCT, ProductSchemaIndexConvertor([product])[0], data.id!);
  await deleteAllRedisKey(REDIS_KEY.ADMIN_PRODUCT_LIST);
  return { message: "Product updated successfully" };
};

// delete-product
export const handleDeleteProduct = async (id: string) => {
  const isExist = await prisma.product.findFirst({ where: { id } });
  if (!isExist) throw new Error("Product not found");
  await deleteImage(isExist.images, "product");
  if (isExist.banner) await deleteImage([isExist.banner], "banner");
  if (isExist.isFeatured) await redis.del(REDIS_KEY.BANNER);
  await prisma.product.delete({ where: { id } });
  await deleteOneItemIndex({ model: TYPESENSE_KEY.PRODUCT, id });
  await deleteOneItemIndex({ model: TYPESENSE_KEY.PRODUCT_BY_TAG, id });
  await deleteAllRedisKey(REDIS_KEY.ADMIN_PRODUCT_LIST);
  revalidatePath(PATH.PRODUCTS);
  return { message: "Product deleted successfully" };
};
