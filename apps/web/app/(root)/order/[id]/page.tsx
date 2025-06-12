import OrderDetail from "@/components/order/order-detail";
import { getOrderInfo } from "@/lib/actions/handler/order.actions";
import { OrderItemType, PaymentFormType, ShippingSchemaType } from "@/types";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CONSTANTS, PAYMENT_METHODS } from "@/lib/constants";
import Stripe from "stripe";

export const metadata = { title: "Order" };

const OrderInfoPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const session = await auth();
  const order = await getOrderInfo(id);
  if (!order.data) notFound();

  let client_secret = null;
  if (order.data.payment === PAYMENT_METHODS.Stripe.key && !order.data.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.data.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.data.id },
    });
    client_secret = paymentIntent.client_secret;
  }
  return (
    <OrderDetail
      isAdmin={session?.user.role === CONSTANTS.ADMIN}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || ""}
      stripeClientSecret={client_secret}
      order={{
        ...order.data,
        orderItems: order.data.orderItems as OrderItemType[],
        address: order.data.address as ShippingSchemaType,
        payment: order.data.payment as PaymentFormType["type"],
      }}
    />
  );
};

export default OrderInfoPage;
