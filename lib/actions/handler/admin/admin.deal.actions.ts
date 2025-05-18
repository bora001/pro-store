"use server";

import { AddDealSchemaType, AddDealType } from "@/types";
import { handleAsync } from "@/utils/handle-async";
import {
  HandleGetAllDealsByQueryType,
  HandleGetDealType,
  HandleHasIncludedDealType,
  handleCreateDeal,
  handleDeleteDeal,
  handleGetAllDealsByQuery,
  handleGetDeal,
  handleHasIncludedDeal,
  handleUpdateDeal,
  handleGetActiveDeal,
  handleGetActiveDealType,
} from "../../services/admin/admin.deal.service";

// get-deal
export async function getDeal(queries: HandleGetDealType) {
  return handleAsync(() => handleGetDeal(queries));
}
// get-all-deals-by-query
export async function getAllDealsByQuery(queries: HandleGetAllDealsByQueryType) {
  return handleAsync(() => handleGetAllDealsByQuery(queries));
}
// get-all-deals-admin
export async function getAllDeals(queries: HandleGetAllDealsByQueryType) {
  return handleAsync(() => handleGetAllDealsByQuery(queries));
}
// get-active-deal
export async function getActiveDeal(queries: handleGetActiveDealType) {
  return handleAsync(() => handleGetActiveDeal(queries));
}
// create-deal
export async function createDeal(queries: AddDealSchemaType) {
  return handleAsync(() => handleCreateDeal(queries));
}
// update-deal
export async function updateDeal(data: Partial<AddDealType>) {
  return handleAsync(() => handleUpdateDeal(data));
}
// delete-deal
export async function deleteDeal(id: string) {
  return handleAsync(() => handleDeleteDeal(id));
}
// deal-included
export async function hasIncludedDeal(queries: HandleHasIncludedDealType) {
  return handleAsync(() => handleHasIncludedDeal(queries));
}
