import OrderDetail from "@/components/order/order-detail";
import { getOrderInfo } from "@/lib/actions/order.actions";
import { ShippingType } from "@/types";
import { notFound } from "next/navigation";
import { PaymentFormType } from "@/components/payment/payment-form";
import { auth } from "@/auth";
import { CONSTANTS } from "@/lib/constants";
import Stripe from "stripe";

export const metadata = {
  title: "Order",
};
const OrderInfoPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const session = await auth();
  const order = await getOrderInfo(id);
  if (!order.data) notFound();

  let client_secret = null;
  if (order.data.payment === "Stripe" && !order.data.isPaid) {
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
        address: order.data.address as ShippingType,
        payment: order.data.payment as PaymentFormType["type"],
      }}
    />
  );
};

export default OrderInfoPage;
