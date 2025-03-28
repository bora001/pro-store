"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { PATH } from "../constants";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { orderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { prismaToJs } from "../utils";

// place-order
export async function createOrder(payment: string | null) {
  try {
    if (!payment) redirect(PATH.PAYMENT);
    const session = await auth();
    const userId = session?.user?.id;
    if (!session || !userId) redirect(PATH.SIGN_IN);
    const cart = await getMyCart();
    if (!cart || !cart.data?.items.length) redirect(PATH.CART);
    const user = await getUserById(userId);
    if (!user.address) redirect(PATH.SHIPPING);
    const order = orderSchema.parse({
      userId: user.id,
      address: user.address,
      payment,
      itemPrice: cart.data.itemPrice,
      taxPrice: cart.data.taxPrice,
      shippingPrice: cart.data.shippingPrice,
      totalPrice: cart.data.totalPrice,
    });

    const newOrderId = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: order,
      });

      await tx.orderItem.createMany({
        data: cart.data.items.map((item) => ({
          ...item,
          price: item.price,
          orderId: newOrder.id,
        })),
      });

      await tx.cart.update({
        where: { id: cart.data.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemPrice: 0,
        },
      });
      return newOrder.id;
    });

    if (!newOrderId) throw new Error("Order is not created");
    redirect(`/order/${newOrderId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: error,
    };
  }
}

// get-order-info
export async function getOrderInfo(orderId: string) {
  try {
    const data = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });
    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}
