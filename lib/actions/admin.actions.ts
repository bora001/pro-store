"use server";

import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { CONSTANTS, PATH, REDIS_KEY, TYPESENSE_KEY } from "../constants";
import { formatError, formatSuccess, prismaToJs } from "../utils";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order.actions";
import {
  AdminDealResult,
  AdminProductResult,
  CartItemType,
  PaymentResultType,
  TagType,
  addDealType,
  updateProductType,
} from "@/types";
import {
  addDealSchema,
  insertProductSchema,
  updateProductSchema,
} from "../validator";
import { z } from "zod";
import { deleteImage } from "./image.actions";
import { deleteOneItemIndex } from "../typesense/deleteOneItemIndex";
import { redis } from "../redis";
import {
  cacheData,
  deleteAllRedisKey,
  getCachedData,
} from "../redis/redis-handler";
import { updateIndex } from "../typesense/updateIndex";
import { createOneIndex } from "../typesense/createOneIndex";
import {
  ProductByTagSchemaIndexConvertor,
  ProductSchemaIndexConvertor,
} from "../typesense/model/index-schema-convertor";

// order-summary
export async function getOrderSummary() {
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt",'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt",'MM/YY') ORDER BY MIN("createdAt") ASC`;

  const salesData = salesDataRaw.map((item) => ({
    month: item.month,
    totalSales: +item.totalSales,
  }));

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    orderCount,
    productCount,
    userCount,
    totalSales,
    salesData,
    latestSales,
  };
}

// all-orders
export async function getAllOrders({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
  query = "",
}: {
  page: number;
  limit?: number;
  query?: string;
}) {
  const queryFilter: Prisma.OrderWhereInput = {
    user: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  };

  const order = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: { select: { name: true } },
    },
  });
  const orderCount = await prisma.order.count();
  return {
    order,
    orderCount,
    totalPages: Math.ceil(orderCount / limit),
  };
}

// update-order-paid
export async function updateOrderToPaidByAdmin(
  orderId: string,
  paymentResult: PaymentResultType
) {
  try {
    await updateOrderToPaid({ orderId, paymentResult });
    revalidatePath(`${PATH.ORDER}/${orderId}`);
    return formatSuccess("Order updated as Paid");
  } catch (error) {
    return formatError(error);
  }
}

// update-order-delivered
export async function updateOrderToDelivered(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });
    revalidatePath(`${PATH.ORDER}/${orderId}`);
    return formatSuccess("Order updated as Delivered");
  } catch (error) {
    return formatError(error);
  }
}

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

// get-users
export async function getAllUsers({
  query,
  // category,
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: {
  page: number;
  limit?: number;
  query: string;
  category?: string;
}) {
  const queryFilter: Prisma.UserWhereInput = query
    ? {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        ],
      }
    : {};

  const user = await prisma.user.findMany({
    where: { ...queryFilter },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  const userCount = await prisma.user.count();
  return {
    user,
    userCount,
    totalPages: Math.ceil(userCount / limit),
  };
}

// get-all-deals-by-query
export async function getAllDealsByQuery({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
  query,
}: {
  page: number;
  limit?: number;
  query: string;
}): Promise<AdminDealResult> {
  const queryFilter: Prisma.DealWhereInput = query
    ? {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            product: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : {};
  const deal = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
    where: {
      ...queryFilter,
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  if (!deal) throw new Error("Deal not found");
  const count = await prisma.deal.count();
  return {
    deal: prismaToJs(deal),
    count,
    totalPages: limit ? Math.ceil(count / limit) : 0,
  };
}

// get-all-deals-admin
export async function getAllDeals({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: {
  page: number;
  limit?: number;
}): Promise<AdminDealResult> {
  const cacheKey = `${REDIS_KEY.ADMIN_DEAL_LIST}_${page}`;

  const cachedList = await getCachedData<AdminDealResult>(cacheKey);
  if (cachedList) {
    return { ...cachedList };
  }
  const deal = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  if (!deal) throw new Error("Deal not found");
  const count = await prisma.deal.count();
  const result = {
    deal: prismaToJs(deal),
    count,
    totalPages: limit ? Math.ceil(count / limit) : 0,
  };
  await cacheData(cacheKey, result, 0);
  return result;
}

// get-active-deal
export async function getActiveDeal({
  id,
  isActive,
}: {
  id?: string;
  isActive?: boolean;
}) {
  try {
    const hasId = id ? { id } : {};
    const hasActive = isActive
      ? {
          product: {
            Deal: {
              some: {
                isActive: true,
              },
            },
          },
        }
      : {};

    const cachedDeal: { hasDeal: boolean; data: addDealType } | null =
      await getCachedData(REDIS_KEY.ACTIVE_DEAL);

    if (cachedDeal !== null && !cachedDeal.hasDeal) {
      return { success: true, data: undefined };
    }

    if (cachedDeal) {
      return {
        success: true,
        data: cachedDeal.data,
      };
    }

    const data = await prisma.deal.findFirst({
      where: {
        ...hasId,
        ...hasActive,
      },
      include: {
        product: {
          select: {
            stock: true,
            images: true,
            price: true,
            slug: true,
            id: true,
            name: true,
            Deal: {
              where: {
                isActive: true,
              },
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    await cacheData(REDIS_KEY.ACTIVE_DEAL, { hasDeal: !!data, data: data }, 0);

    if (!data) throw new Error("Deal not found");

    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return formatError(error);
  }
}
// get-deal
export async function getDeal({
  id,
  isActive,
}: {
  id?: string;
  isActive?: boolean;
}) {
  try {
    const hasId = id ? { id } : {};
    const hasActive = isActive
      ? {
          product: {
            Deal: {
              some: {
                isActive: true,
              },
            },
          },
        }
      : {};

    const data = await prisma.deal.findFirst({
      where: {
        ...hasId,
        ...hasActive,
      },
      include: {
        product: {
          select: {
            stock: true,
            images: true,
            price: true,
            slug: true,
            id: true,
            name: true,
            Deal: {
              where: {
                isActive: true,
              },
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!data) throw new Error("Deal not found");

    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return formatError(error);
  }
}
// create-deal
export async function createDeal(values: z.infer<typeof addDealSchema>) {
  try {
    const data = addDealSchema.parse(values);
    if (!data.endTime) {
      throw new Error("End time is required.");
    }
    await prisma.deal.create({
      data: { ...data, endTime: data.endTime },
    });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    return formatSuccess("Deal created successfully");
  } catch (error) {
    return formatError(error);
  }
}

// update-deal
export async function updateDeal(data: Partial<addDealType>) {
  try {
    if (!data.id) throw new Error("ID is undefined");
    const isOtherActive = await prisma.deal.findFirst({
      where: { isActive: true },
    });
    if (isOtherActive && isOtherActive.id !== data.id && data.isActive)
      throw new Error("Active deal already exists.");
    const deals = await prisma.deal.findFirst({
      where: { id: data.id },
    });
    if (!deals) throw new Error("Deal not found");
    if (data.isActive || (deals.isActive && !data.isActive)) {
      await redis.del(REDIS_KEY.ACTIVE_DEAL);
      await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    }
    const { endTime, product: _product, ...rest } = data;
    await prisma.deal.update({
      where: { id: data.id },
      data: {
        ...rest,
        ...(endTime && { endTime }),
      },
    });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    return formatSuccess("Deal updated successfully");
  } catch (error) {
    return formatError(error);
  }
}

// delete-deal
export async function deleteDeal(id: string) {
  try {
    const isExist = await prisma.deal.findFirst({
      where: { id },
    });
    if (!isExist) throw new Error("Deal not found");
    await prisma.deal.delete({
      where: {
        id,
      },
    });
    await deleteAllRedisKey(REDIS_KEY.ADMIN_DEAL_LIST);
    return formatSuccess("Deal deleted successfully");
  } catch (error) {
    return formatError(error);
  }
}

// deal-included
export async function hasIncludedDeal({
  items,
  dealOptions,
}: {
  items: CartItemType[];
  dealOptions?: Prisma.DealWhereInput;
}) {
  const productId = items.map((item) => item.productId);
  try {
    const deal = await prisma.deal.findMany({
      where: {
        productId: { in: productId },
        isActive: true,
        ...dealOptions,
      },
    });
    if (!deal.length) throw new Error("Deal not found");
    return {
      success: true,
      data: prismaToJs(deal[0]),
    };
  } catch (error) {
    return formatError(error);
  }
}

//get-setting
export async function getSetting() {
  try {
    const data = await prisma.setting.findFirst({
      where: { id: 1 },
      include: { tags: true },
    });
    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return formatError(error);
  }
}

//update-setting
export async function updateSetting(
  updates: Partial<{ [key: string]: string }>
) {
  try {
    const data: Partial<{
      [key: string]: string;
    }> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        data[key] = value;
      }
    }
    await prisma.setting.update({
      where: { id: 1 },
      data,
    });
    revalidatePath(PATH.SETTING);
    return formatSuccess("Setting updated or created successfully.");
  } catch (error) {
    return formatError(error);
  }
}

// get-tags
export async function getTags() {
  try {
    const tags = await prisma.setting.findMany({
      where: { id: 1 },
      select: { tags: true },
    });
    return {
      success: true,
      message: "Successfully retrieved tags",
      data: tags,
    };
  } catch (error) {
    return formatError(error);
  }
}

// add-tag
export async function addTag(name: string) {
  try {
    await prisma.setting.update({
      where: { id: 1 },
      data: {
        tags: {
          create: { name: name.toLowerCase() },
        },
      },
    });
    revalidatePath(PATH.SETTING);
    return formatSuccess("Tags updated successfully");
  } catch (error) {
    return formatError(error);
  }
}
// delete-tag
export async function removeTagById(id: string) {
  try {
    await prisma.setting.update({
      where: { id: 1 },
      data: {
        tags: {
          delete: {
            id,
          },
        },
      },
    });
    revalidatePath(PATH.SETTING);
    return formatSuccess("Tags deleted successfully");
  } catch (error) {
    return formatError(error);
  }
}
