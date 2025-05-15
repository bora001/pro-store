"use server";

import { PaymentFormType } from "@/components/payment/payment-form";
import { handleAsync } from "@/utils/handle-async";
import {
  handleApprovalPaypalOrder,
  handleApprovalPaypalOrderType,
  handleCreateOrder,
  handleCreatePaypalOrder,
  handleGetOrderInfo,
  handleGetUserOrder,
  handleGetUserOrderType,
  handleSendEmailReceipt,
  handleUpdateOrderToPaid,
  handleUpdateOrderToPaidType,
} from "../services/order.service";

// place-order
export async function createOrder(payment: PaymentFormType["type"]) {
  return handleAsync(() => handleCreateOrder(payment));
}
// get-order-info
export async function getOrderInfo(orderId: string) {
  return handleAsync(() => handleGetOrderInfo(orderId));
}
// paypal-order
export async function createPaypalOrder(orderId: string) {
  return handleAsync(() => handleCreatePaypalOrder(orderId));
}
// approve-paypal
export async function approvalPaypalOrder(
  queries: handleApprovalPaypalOrderType
) {
  return handleAsync(() => handleApprovalPaypalOrder(queries));
}
// update paid
export async function updateOrderToPaid(queries: handleUpdateOrderToPaidType) {
  return handleAsync(() => handleUpdateOrderToPaid(queries));
}
// email-receipt
export async function sendEmailReceipt(orderId: string) {
  return handleAsync(() => handleSendEmailReceipt(orderId));
}
// user's-order
export async function getUserOrder(data: handleGetUserOrderType) {
  return handleAsync(() => handleGetUserOrder(data));
}
