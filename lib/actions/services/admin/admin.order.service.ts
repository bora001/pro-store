"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS, PATH } from "@/lib/constants";
import { PaymentResultType } from "@/types";
import { Prisma } from "@prisma/client";
import { updateOrderToPaid } from "../../handler/order.actions";
import { revalidatePath } from "next/cache";

// order-summary
export const fetchGetOrderSummary = async () => {
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
    include: { user: { select: { name: true } } },
    take: 6,
  });

  return {
    data: {
      orderCount,
      productCount,
      userCount,
      totalSales,
      salesData,
      latestSales,
    },
  };
};
// all-orders
export type FetchGetAllOrdersType = {
  page: number;
  limit?: number;
  query?: string;
};
export const fetchGetAllOrders = async ({
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
  query = "",
}: FetchGetAllOrdersType) => {
  const queryFilter: Prisma.OrderWhereInput = {
    user: { name: { contains: query, mode: "insensitive" } },
  };

  const order = await prisma.order.findMany({
    where: { ...queryFilter },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });
  const orderCount = await prisma.order.count();
  return {
    data: {
      order,
      orderCount,
      totalPages: Math.ceil(orderCount / limit),
    },
  };
};
// update-order-paid
export type FetchUpdateOrderToPaidByAdminType = {
  orderId: string;
  paymentResult: PaymentResultType;
};
export const fetchUpdateOrderToPaidByAdmin = async ({ orderId, paymentResult }: FetchUpdateOrderToPaidByAdminType) => {
  await updateOrderToPaid({ orderId, paymentResult });
  revalidatePath(`${PATH.ORDER}/${orderId}`);
  return { message: "Order updated as Paid" };
};

// update-order-delivered
export const fetchUpdateOrderToDelivered = async (orderId: string) => {
  const order = await prisma.order.findFirst({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (!order.isPaid) throw new Error("Order is not paid");

  await prisma.order.update({
    where: { id: orderId },
    data: { isDelivered: true, deliveredAt: new Date() },
  });
  revalidatePath(`${PATH.ORDER}/${orderId}`);
  return { message: "Order updated as Delivered" };
};

// delete-order
export const fetchDeleteOrder = async (id: string) => {
  await prisma.order.delete({ where: { id } });
  revalidatePath(PATH.ORDERS);
  return { message: "Order is deleted successfully" };
};
