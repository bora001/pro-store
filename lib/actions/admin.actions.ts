"use server";

import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { CONSTANTS } from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order.actions";
import { PaymentResult } from "@/types";

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
}: {
  page: number;
  limit?: number;
}) {
  const order = await prisma.order.findMany({
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
  paymentResult: PaymentResult
) {
  try {
    await updateOrderToPaid({ orderId, paymentResult });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order updated as Paid" };
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
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order updated as Delivered" };
  } catch (error) {
    return formatError(error);
  }
}

// all-products
export async function getAllProducts({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: {
  page: number;
  limit?: number;
}) {
  const product = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  const productCount = await prisma.product.count();
  return {
    product,
    productCount,
    totalPages: Math.ceil(productCount / limit),
  };
}
