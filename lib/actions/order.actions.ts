"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { CONSTANTS, PATH } from "../constants";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { orderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { formatError, formatSuccess, prismaToJs } from "../utils";
import { paypal } from "../paypal";
import {
  OrderItemType,
  PaymentResultType,
  ProductItemType,
  ShippingType,
} from "@/types";
import { revalidatePath } from "next/cache";
import { sendPurchaseReceipt } from "@/email";
import { PaymentFormType } from "@/components/payment/payment-form";
import { hasIncludedDeal } from "./admin.actions";
import { calculatePrice } from "@/utils/price/calculate-price";

// place-order
export async function createOrder(payment: PaymentFormType["type"]) {
  try {
    if (!payment) redirect(PATH.PAYMENT);
    const session = await auth();
    const userId = session?.user?.id;
    if (!session || !userId) redirect(PATH.SIGN_IN);
    const cart = await getMyCart();
    if (!cart || !cart.data?.items.length) redirect(PATH.CART);
    const user = await getUserById(userId);
    if (!user.address) redirect(PATH.SHIPPING);
    const activeDeal = await hasIncludedDeal({
      items: cart.data.items,
      dealOptions: { endTime: { gte: new Date() } },
    });
    const cart_price = calculatePrice(cart.data.items, activeDeal.data);
    const order = orderSchema.parse({
      userId: user.id,
      address: user.address,
      payment,
      ...cart_price,
    });

    const newOrderId = await prisma.$transaction(async (tx) => {
      for (const item of cart.data.items) {
        const [product]: ProductItemType[] = await tx.$queryRawUnsafe(
          `SELECT * FROM "Product" WHERE id = $1 FOR UPDATE`,
          item.productId
        );

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });

        if (!product || product.stock < item.qty || !item.qty) {
          throw new Error(
            "One or more items in your cart are no longer available"
          );
        }
      }

      const newOrder = await tx.order.create({
        data: order,
      });
      const { productId } = activeDeal.data || {};

      await tx.orderItem.createMany({
        data: cart.data.items.map(({ discount: _discount, ...item }) => {
          const hasDeal = productId === item.productId;
          return {
            ...item,
            price: item.price,
            orderId: newOrder.id,
            dealInfo: hasDeal ? activeDeal.data : {},
          };
        }),
      });

      await tx.cart.update({
        where: { id: cart.data.id },
        data: {
          items: [],
        },
      });
      return newOrder.id;
    });

    if (!newOrderId) throw new Error("Order is not created");
    redirect(`${PATH.ORDER}/${newOrderId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return formatError(error);
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
    return formatError(error);
  }
}

// paypal-order
export async function createPaypalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!order) throw new Error("order not found");
    const paypalOrder = await paypal.createOrder(+order.totalPrice);
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          email_address: "",
          pricePaid: "",
          status: "",
        },
      },
    });
    return {
      success: true,
      message: "Item order created successfully",
      data: paypalOrder.id,
    };
  } catch (error) {
    return formatError(error);
  }
}

// approve-paypal
export async function approvalPaypalOrder(
  orderId: string,
  data: {
    orderID: string;
  }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new Error("Order not found");
    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResultType).id ||
      captureData.status !== CONSTANTS.COMPLETED
    ) {
      throw new Error("Error in paypal payment");
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0].payments?.captures[0].amount.value,
      },
    });
    revalidatePath(`${PATH.ORDER}/${orderId}`);
    return formatSuccess("Order has been paid");
  } catch (error) {
    return formatError(error);
  }
}

// update paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResultType;
}) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
      },
    });
    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("Order is already paid");
    await prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: -item.qty } },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult,
        },
      });
    });
    const updateOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });
    if (!updateOrder) throw new Error("Order not found");
  } catch (error) {
    return formatError(error);
  }
}
// email-receipt
export async function sendEmailReceipt(orderId: string) {
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
    if (!data) throw new Error("Order not found");
    await sendPurchaseReceipt({
      order: {
        ...data,
        orderItems: data.orderItems as OrderItemType[],
        address: data.address as ShippingType,
        paymentResult: data.paymentResult as PaymentResultType,
      },
    });
    return formatSuccess("Email sent successfully");
  } catch (error) {
    return formatError(error);
  }
}

// user's-order
export async function getUserOrder({
  limit = 5,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User not found");

  const data = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session.user?.id },
  });
  return { data, totalPages: Math.ceil(dataCount / limit) };
}

// delete-order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    });
    revalidatePath(PATH.ORDERS);
    return formatSuccess("Order is deleted successfully");
  } catch (error) {
    return formatError(error);
  }
}
