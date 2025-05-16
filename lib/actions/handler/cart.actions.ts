"use server";

import { CartItemType } from "@/types";
import { handleAsync } from "@/utils/handle-async";
import {
  HandleCartQueries,
  handleAddItemToCart,
  handleGetMyCart,
  handleModifyItemQtyToCart,
  handleRemoveItemToCart,
} from "../services/cart.service";
import { measurePerformance } from "@/utils/measure-performance";

// add-item-to-cart
export async function addItemToCart(queries: HandleCartQueries & { cartId?: string }) {
  return measurePerformance(() => handleAsync(() => handleAddItemToCart(queries)), "addItemToCart");
}
// get-cart
export async function getMyCart(userId?: string) {
  return handleAsync(() => handleGetMyCart(userId));
}
// modify-cart
export async function modifyItemQtyToCart(queries: HandleCartQueries & { cartId: string }) {
  return measurePerformance(() => handleAsync(() => handleModifyItemQtyToCart(queries)), "modifyItemQtyToCart");
}
// remove-item-from-cart
export async function removeItemToCart(data: CartItemType & { cartId: string }) {
  return measurePerformance(() => handleAsync(() => handleRemoveItemToCart(data)), "removeItemToCart");
}
