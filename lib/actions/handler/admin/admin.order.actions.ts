"use server";

import {
  FetchGetAllOrdersType,
  FetchUpdateOrderToPaidByAdminType,
  fetchDeleteOrder,
  fetchGetAllOrders,
  fetchGetOrderSummary,
  fetchUpdateOrderToDelivered,
  fetchUpdateOrderToPaidByAdmin,
} from "../../services/admin/admin.order.service";
import { handleAsync } from "@/utils/handle-async";

// order-summary
export async function getOrderSummary() {
  return handleAsync(() => fetchGetOrderSummary());
}
// all-orders
export async function getAllOrders(data: FetchGetAllOrdersType) {
  return handleAsync(() => fetchGetAllOrders(data));
}
// update-order-paid
export async function updateOrderToPaidByAdmin(data: FetchUpdateOrderToPaidByAdminType) {
  return handleAsync(() => fetchUpdateOrderToPaidByAdmin(data));
}
// update-order-delivered
export async function updateOrderToDelivered(orderId: string) {
  return handleAsync(() => fetchUpdateOrderToDelivered(orderId));
}
// delete-order
export async function deleteOrder(id: string) {
  return handleAsync(() => fetchDeleteOrder(id));
}
