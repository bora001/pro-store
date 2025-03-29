"use server";

import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";

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
