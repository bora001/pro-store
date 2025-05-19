"use server";

import { InsertProductSchemaType, UpdateProductSchemaType } from "@/types";

import { handleAsync } from "@/utils/handle-async";
import {
  HandleGetAllAdminProductType,
  HandleGetProductType,
  handleCreateProduct,
  handleDeleteProduct,
  handleGetAllAdminProduct,
  handleGetProduct,
  handleUpdateProduct,
} from "../../services/admin/admin.product.service";

// get-product
export async function getProduct(data: HandleGetProductType) {
  return handleAsync(() => handleGetProduct(data));
}
// get-all-product-admin
export async function getAllAdminProduct(data: HandleGetAllAdminProductType) {
  return handleAsync(() => handleGetAllAdminProduct(data));
}
// create-product
export async function createProduct(data: InsertProductSchemaType) {
  return handleAsync(() => handleCreateProduct(data));
}
// update-product
export async function updateProduct(data: UpdateProductSchemaType) {
  return handleAsync(() => handleUpdateProduct(data));
}
// delete-product
export async function deleteProduct(id: string) {
  return handleAsync(() => handleDeleteProduct(id));
}
