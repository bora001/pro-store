import { updateOrderToPaid } from "@/lib/actions/handler/order.actions";
import { CONSTANTS } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const event = Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  if (event.type === "charge.succeeded") {
    const { object } = event.data;
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: CONSTANTS.COMPLETED,
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({
      message: "updateToOrderPaid is successful",
    });
  }

  return NextResponse.json({
    message: "event is not charged.succeeded",
  });
}
