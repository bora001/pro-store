"use server";

import {
  HandleGetAllOrdersType,
  HandleUpdateOrderToPaidByAdminType,
  handleDeleteOrder,
  handleGetAllOrders,
  handleGetOrderSummary,
  handleUpdateOrderToDelivered,
  handleUpdateOrderToPaidByAdmin,
} from "../../services/admin/admin.order.service";
import { handleAsync } from "@/utils/handle-async";

// order-summary
export async function getOrderSummary() {
  return handleAsync(() => handleGetOrderSummary());
}
// all-orders
export async function getAllOrders(data: HandleGetAllOrdersType) {
  return handleAsync(() => handleGetAllOrders(data));
}
// update-order-paid
export async function updateOrderToPaidByAdmin(data: HandleUpdateOrderToPaidByAdminType) {
  return handleAsync(() => handleUpdateOrderToPaidByAdmin(data));
}
// update-order-delivered
export async function updateOrderToDelivered(orderId: string) {
  return handleAsync(() => handleUpdateOrderToDelivered(orderId));
}
// delete-order
export async function deleteOrder(id: string) {
  return handleAsync(() => handleDeleteOrder(id));
}
