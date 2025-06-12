"use server";

import { OrderType } from "@/types";
import { sendEmail } from ".";
import WelcomeMailTemplate from "./template/welcome-mail-template";
import PurchaseReceiptTemplate from "./template/purchase-receipt-template";
import EmailVerificationTemplate from "./template/email-verification-template";
import DeleteAccountTemplate from "./template/delete-account-template";
import { render } from "@react-email/components";

export const sendPurchaseReceipt = async ({ order, email }: { order: Omit<OrderType, "payment">; email: string }) => {
  const html = await render(<PurchaseReceiptTemplate order={order} />, { pretty: true });
  return await sendEmail({ html, to: email, subject: `[Demo] - Order Confirmation #${order.id}` });
};

export const sendWelcomeEmail = async ({ name, email }: { name: string; email: string }) => {
  const html = await render(<WelcomeMailTemplate name={name} />, { pretty: true });
  return await sendEmail({ html, to: email, subject: "Welcome to Pro-store!" });
};

export const sendEmailVerification = async ({ token, email }: { token: string; email: string }) => {
  const html = await render(<EmailVerificationTemplate token={token} />, { pretty: true });
  return await sendEmail({ html, to: email, subject: "Verify your email to sign up for pro-store" });
};

export const sendDeleteAccountConfirm = async ({ email, name }: { email: string; name: string }) => {
  const html = await render(<DeleteAccountTemplate name={name} />, { pretty: true });
  return await sendEmail({ html, to: email, subject: "Your Pro-Store Account Deletion Request Has Been Processed." });
};
