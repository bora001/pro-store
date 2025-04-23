"use server";

import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { CONSTANTS, PATH } from "../constants";
import { formatError, formatSuccess, prismaToJs } from "../utils";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order.actions";
import {
  CartItemType,
  PaymentResultType,
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
import { createOneProductIndex } from "../typesense/createOneProductIndex";
import { updateProductIndex } from "../typesense/updateProductIndex";
import { deleteItemIndex } from "../typesense/deleteOneItem";

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

// all-products
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
  const productCount = await prisma.product.count();
  return {
    product: prismaToJs(product),
    productCount,
    totalPages: limit ? Math.ceil(productCount / limit) : 0,
  };
}

// delete-products
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
    await prisma.product.delete({
      where: {
        id,
      },
    });
    await deleteItemIndex({ model: "products", id });
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
    const result = await prisma.product.create({ data: product });
    await createOneProductIndex({
      ...product,
      id: result.id,
      rating: 0,
      createdAt: new Date().getTime(),
    });
    revalidatePath(PATH.PRODUCTS);
    return formatSuccess("Product created successfully");
  } catch (error) {
    return formatError(error);
  }
}

// update-product
export async function updateProduct(data: updateProductType) {
  try {
    const isProductExist = await prisma.product.findFirst({
      where: { id: data.id },
    });
    if (!isProductExist) throw new Error("Product not found");
    const product = updateProductSchema.parse(data);
    await prisma.product.update({
      where: { id: data.id },
      data: product,
    });
    await updateProductIndex({
      ...product,
      id: data.id!,
      createdAt: isProductExist.createdAt.getTime(),
      rating: +isProductExist.rating,
    });
    revalidatePath(PATH.PRODUCTS);
    return formatSuccess("Product updated successfully");
  } catch (error) {
    return formatError(error);
  }
}

// get-product
export async function getProduct(id: string) {
  const product = await prisma.product.findFirst({
    where: { id },
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

// get-all-deals
export async function getAllDeals({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
  query,
}: {
  page: number;
  limit?: number;
  query: string;
}) {
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
        include: {
          Deal: true,
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

  return deal;
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
    const hasActive = isActive ? { isActive } : {};
    const deal = await prisma.deal.findFirst({
      where: { ...hasId, ...hasActive },
      include: {
        product: {
          include: {
            Deal: true,
          },
        },
      },
    });
    if (!deal) throw new Error("Deal not found");
    return {
      success: true,
      data: prismaToJs(deal),
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
    revalidatePath(PATH.DEALS);
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
    const { endTime, productId: _productId, product: _product, ...rest } = data;
    await prisma.deal.update({
      where: { id: data.id },
      data: {
        ...rest,
        ...(endTime && { endTime }),
      },
    });
    revalidatePath(PATH.DEALS);
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
    revalidatePath(PATH.DEALS);
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
