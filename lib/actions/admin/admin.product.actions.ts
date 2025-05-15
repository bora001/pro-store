"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS, PATH, REDIS_KEY, TYPESENSE_KEY } from "@/lib/constants";
import { redis } from "@/lib/redis";
import {
  cacheData,
  deleteAllRedisKey,
  getCachedData,
} from "@/lib/redis/redis-handler";
import { createOneIndex } from "@/lib/typesense/create-one-Index";
import {
  ProductByTagSchemaIndexConvertor,
  ProductSchemaIndexConvertor,
} from "@/lib/typesense/model/index-schema-convertor";
import { updateIndex } from "@/lib/typesense/update-index";
import { formatError, formatSuccess, prismaToJs } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { AdminProductResult, TagType, updateProductType } from "@/types";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteImage } from "../image.actions";
import { deleteOneItemIndex } from "@/lib/typesense/delete-one-item-index";
import { z } from "zod";

// get-product
export async function getProduct(
  id: string,
  props?: Prisma.ProductFindFirstArgs
) {
  const product = await prisma.product.findFirst({
    where: { id },
    ...props,
  });
  if (!product) throw new Error("Product not found");
  return prismaToJs(product);
}

// get-all-product-admin
export async function getAllAdminProduct({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: {
  page?: number;
  limit?: number;
}): Promise<AdminProductResult> {
  const cacheKey = `${REDIS_KEY.ADMIN_PRODUCT_LIST}_${page}`;
  const cachedList = await getCachedData<AdminProductResult>(cacheKey);
  if (cachedList) {
    return { ...cachedList };
  }
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
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    ...pagination,
  });
  const count = await prisma.product.count();
  const result = {
    product: prismaToJs(product),
    count,
    totalPages: limit ? Math.ceil(count / limit) : 0,
  };
  await cacheData(cacheKey, result, 0);
  return result;
}

// create-product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    const result = await prisma.product.create({
      data: {
        ...product,
        tags: {
          connect: product.tags?.map((tag: TagType) => ({ id: tag.id })),
        },
      },
    });
    if (data.isFeatured) {
      await redis.del(REDIS_KEY.BANNER);
    }
    // update-typesense
    const updateData = {
      ...product,
      id: result.id,
    };
    await createOneIndex(
      TYPESENSE_KEY.PRODUCT,
      ProductSchemaIndexConvertor([updateData])
    );
    await createOneIndex(
      TYPESENSE_KEY.PRODUCT_BY_TAG,
      ProductByTagSchemaIndexConvertor([updateData])
    );
    await deleteAllRedisKey(REDIS_KEY.ADMIN_PRODUCT_LIST);
    return formatSuccess("Product created successfully");
  } catch (error) {
    return formatError(error);
  }
}
// update-product
export async function updateProduct(data: updateProductType) {
  try {
    const originalProductData = await prisma.product.findFirst({
      where: { id: data.id },
    });
    if (!originalProductData) throw new Error("Product not found");
    if (
      (originalProductData.isFeatured && !data.isFeatured) ||
      (!originalProductData.isFeatured && data.isFeatured)
    ) {
      await redis.del(REDIS_KEY.BANNER);
    }
    const product = updateProductSchema.parse(data);
    await prisma.product.update({
      where: { id: data.id },
      data: {
        ...product,
        tags: {
          set: product.tags?.map((tag) => ({ id: tag.id })),
        },
      },
    });

    // redis + typesense
    await updateIndex(
      TYPESENSE_KEY.PRODUCT_BY_TAG,
      ProductByTagSchemaIndexConvertor([product])[0],
      data.id!
    );
    await updateIndex(
      TYPESENSE_KEY.PRODUCT,
      ProductSchemaIndexConvertor([product])[0],
      data.id!
    );
    await deleteAllRedisKey(REDIS_KEY.ADMIN_PRODUCT_LIST);
    return formatSuccess("Product updated successfully");
  } catch (error) {
    return formatError(error);
  }
}

// delete-product
export async function deleteProduct(id: string) {
  try {
    const isExist = await prisma.product.findFirst({
      where: { id },
    });
    if (!isExist) throw new Error("Product not found");
    await deleteImage(isExist.images, "product");
    if (isExist.banner) {
      await deleteImage([isExist.banner], "banner");
    }
    if (isExist.isFeatured) {
      await redis.del(REDIS_KEY.BANNER);
    }
    await prisma.product.delete({
      where: {
        id,
      },
    });
    await deleteOneItemIndex({ model: TYPESENSE_KEY.PRODUCT, id });
    await deleteOneItemIndex({ model: TYPESENSE_KEY.PRODUCT_BY_TAG, id });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_PRODUCT_LIST);
    revalidatePath(PATH.PRODUCTS);
    return formatSuccess("Product deleted successfully");
  } catch (error) {
    return formatError(error);
  }
}
