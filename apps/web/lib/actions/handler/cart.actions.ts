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
import { CartInfoType } from "@/components/product/add-to-cart";

// add-item-to-cart
export async function addItemToCart(queries: HandleCartQueries & CartInfoType) {
  return handleAsync(() => handleAddItemToCart(queries));
}
// get-cart
export async function getMyCart(userId?: string) {
  return handleAsync(() => handleGetMyCart(userId));
}
// modify-cart
export async function modifyItemQtyToCart(queries: HandleCartQueries & { cartId: string }) {
  return handleAsync(() => handleModifyItemQtyToCart(queries));
}
// remove-item-from-cart
export async function removeItemToCart(data: CartItemType & { cartId: string }) {
  return handleAsync(() => handleRemoveItemToCart(data));
}
