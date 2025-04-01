import { Button } from "@/components/ui/button";
import { getOrderInfo } from "@/lib/actions/order.actions";
import { PATH } from "@/lib/constants";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import Stripe from "stripe";
const StripeSuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const order = await getOrderInfo(id);
  if (!order) notFound();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const paymentIntentOrderId = paymentIntent.metadata.orderId;
  if (paymentIntentOrderId === null || paymentIntentOrderId !== order.data?.id)
    return notFound();

  const isSuccess = paymentIntent.status === "succeeded";
  if (isSuccess) return redirect(`${PATH.ORDER}/${id}`);

  return (
    <div className="max-w-4wl w-full mx-auto space-y-8 h-full flex flex-col gap-6 items-center justify-center">
      <div className="space-y-2">
        <h2 className="h2-bold">Thanks for your purchase</h2>
        <div>We are processing your order</div>
        <div className="py-4">
          <Button className="w-full">
            <Link href={`/order/${id}`}>View Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StripeSuccessPage;
