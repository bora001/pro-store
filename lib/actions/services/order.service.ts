"use server";

import { auth } from "@/auth";
import { CONSTANTS, PATH, TYPESENSE_KEY } from "@/lib/constants";
import { redirect } from "next/navigation";
import { getMyCart } from "../handler/cart.actions";
import { getUserById } from "../handler/user.action";
import { hasIncludedDeal } from "../handler/admin/admin.deal.actions";
import { PaymentFormType } from "@/components/payment/payment-form";
import { calculatePrice } from "@/utils/price/calculate-price";
import { orderSchema } from "@/lib/validator";
import { prisma } from "@/db/prisma";
import { OrderItemType, PaymentResultType, ProductItemType, ShippingSchemaType } from "@/types";
import { updateIndex } from "@/lib/typesense/update-index";
import { prismaToJs } from "@/lib/utils";
import { paypal } from "@/lib/paypal";
import { updateOrderToPaid } from "../handler/order.actions";
import { revalidatePath } from "next/cache";
import { sendPurchaseReceipt } from "@/lib/email/mail-handler";
import { getUserInfo } from "../utils/session.utils";

export async function handleCreateOrder(payment: PaymentFormType["type"]) {
  if (!payment) redirect(PATH.PAYMENT);
  const userId = await getUserInfo();
  if (!userId) redirect(PATH.SIGN_IN);

  const cart = await getMyCart(userId);
  if (!cart || !cart.data?.items.length) redirect(PATH.CART);

  const { data: user } = await getUserById(userId);
  if (!user) throw new Error("User not found");
  if (!user.address) redirect(PATH.SHIPPING);

  const activeDeal = await hasIncludedDeal({ items: cart.data.items, dealOptions: { endTime: { gte: new Date() } } });
  const cart_price = calculatePrice(cart.data.items, activeDeal.data);
  const order = orderSchema.parse({ userId: user.id, address: user.address, payment, ...cart_price });

  const newOrderId = await prisma.$transaction(async (tx) => {
    if (!cart.data) throw new Error("Cart is empty");
    for (const item of cart.data.items) {
      const [product]: ProductItemType[] = await tx.$queryRawUnsafe(
        `SELECT * FROM "Product" WHERE id = $1 FOR UPDATE`,
        item.productId
      );

      if (!product || product.stock < item.qty || !item.qty)
        throw new Error("One or more items in your cart are no longer available");
      const updatedProduct = await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
        select: {
          id: true,
          name: true,
          category: true,
          stock: true,
          price: true,
          createdAt: true,
          rating: true,
          description: true,
          brand: true,
          numReviews: true,
        },
      });

      // update typesense
      updateIndex(TYPESENSE_KEY.PRODUCT, updatedProduct, updatedProduct.id);
    }

    const newOrder = await tx.order.create({ data: order });
    const { productId } = activeDeal.data || {};

    await tx.orderItem.createMany({
      data: cart.data.items.map(({ ...item }) => {
        const hasDeal = productId === item.productId;
        return { ...item, price: item.price, orderId: newOrder.id, dealInfo: hasDeal ? activeDeal.data : {} };
      }),
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.data.id } });
    return newOrder.id;
  });

  if (!newOrderId) throw new Error("Order is not created");
  return redirect(`${PATH.ORDER}/${newOrderId}`);
}

export async function handleGetOrderInfo(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true, user: { select: { name: true, email: true } } },
  });

  return { data: prismaToJs(data) };
}

export async function handleCreatePaypalOrder(orderId: string) {
  const order = await prisma.order.findFirst({ where: { id: orderId } });
  if (!order) throw new Error("order not found");
  const paypalOrder = await paypal.createOrder(+order.totalPrice);
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentResult: { id: paypalOrder.id, email_address: "", pricePaid: "", status: "" } },
  });
  return { message: "Item order created successfully", data: paypalOrder.id };
}

export type handleApprovalPaypalOrderType = { orderId: string; data: { orderID: string } };

export async function handleApprovalPaypalOrder({ orderId, data: { orderID } }: handleApprovalPaypalOrderType) {
  const order = await prisma.order.findFirst({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const captureData = await paypal.capturePayment(orderID);
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
      pricePaid: captureData.purchase_units[0].payments?.captures[0].amount.value,
    },
  });
  revalidatePath(`${PATH.ORDER}/${orderId}`);
  return { message: "Order has been paid" };
}

export type handleUpdateOrderToPaidType = { orderId: string; paymentResult?: PaymentResultType };

export async function handleUpdateOrderToPaid({ orderId, paymentResult }: handleUpdateOrderToPaidType) {
  const order = await prisma.order.findFirst({ where: { id: orderId }, include: { orderItems: true } });
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
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
  });
  const updateOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true, user: { select: { name: true, email: true } } },
  });
  if (!updateOrder) throw new Error("Order not found");
  return {};
}

export async function handleSendEmailReceipt(orderId: string) {
  const session = await auth();
  if (!session) throw new Error("User not found");
  if (!session.user.email) throw new Error("Email not found");

  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true, user: { select: { name: true, email: true } } },
  });
  if (!data) throw new Error("Order not found");
  await sendPurchaseReceipt({
    order: {
      ...data,
      orderItems: data.orderItems as OrderItemType[],
      address: data.address as ShippingSchemaType,
      paymentResult: data.paymentResult as PaymentResultType,
    },
    email: session.user.email,
  });
  return { message: "Email sent successfully" };
}

export type handleGetUserOrderType = { limit?: number; page: number };
export async function handleGetUserOrder({ limit = 5, page }: handleGetUserOrderType) {
  const session = await auth();
  if (!session) throw new Error("User not found");

  const data = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({ where: { userId: session.user?.id } });
  return { data: { data, totalPages: Math.ceil(dataCount / limit) } };
}
