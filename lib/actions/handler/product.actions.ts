"use server";

import { handleAsync } from "@/utils/handle-async";
import {
  handleAllProducts,
  handleLatestProducts,
  handleProductBySlug,
} from "../services/product.service";

export type GetAlProductsQuery = {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  rating?: string;
  sort?: string;
  price?: string;
};

// latest products
export async function getLatestProducts() {
  return handleAsync(handleLatestProducts);
}
// single products by slug
export async function getProductBySlug(slug: string) {
  return handleAsync(() => handleProductBySlug(slug));
}
// get-all-products
export async function getAllProducts(queries: GetAlProductsQuery) {
  return handleAsync(() => handleAllProducts(queries));
}
