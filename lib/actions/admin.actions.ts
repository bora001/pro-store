"use server";

import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { CONSTANTS, PATH } from "../constants";
import { formatError, formatSuccess, prismaToJs } from "../utils";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order.actions";
import { PaymentResultType, updateProductType } from "@/types";
import { insertProductSchema, updateProductSchema } from "../validator";
import { z } from "zod";
import { deleteImage } from "./image.actions";

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
  >`SELECT to_char("createdAt",'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt",'MM/YY')`;
  //
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
  query,
  category,
  page = 1,
  price,
  rating,
  sort,
  limit,
}: {
  page: number;
  limit?: number;
  query: string;
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
    orderBy: sort ? sortFilter[sort] : sortFilter.default,
    take: limit,
    ...pagination,
  });
  const productCount = await prisma.product.count();
  return {
    product,
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
    await prisma.product.create({ data: product });
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
