import { CONFIG } from "@/lib/constants/config";
import { OrderType } from "@/types";
import "dotenv/config";
import { Resend } from "resend";
import PurchaseReceipt from "./purchase-receipt";
const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({
  order,
}: {
  order: Omit<OrderType, "payment">;
}) => {
  await resend.emails.send({
    from: `${CONFIG.APP_NAME} <${CONFIG.SENDER_EMAIL}>`,
    to: [order.user.email],
    subject: `[Demo] - Order Confirmation #${order.id}`,
    react: <PurchaseReceipt order={order} />,
  });
};
