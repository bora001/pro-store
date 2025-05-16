"use server";

import { addDealType } from "@/types";
import { handleAsync } from "@/utils/handle-async";
import {
  FetchCreateDealType,
  FetchGetAllDealsByQueryType,
  FetchGetDealType,
  FetchHasIncludedDealType,
  fetchCreateDeal,
  fetchDeleteDeal,
  fetchGetAllDealsByQuery,
  fetchGetDeal,
  fetchHasIncludedDeal,
  fetchUpdateDeal,
  handleGetActiveDeal,
  handleGetActiveDealType,
} from "../../services/admin/admin.deal.service";

// get-deal
export async function getDeal(queries: FetchGetDealType) {
  return handleAsync(() => fetchGetDeal(queries));
}
// get-all-deals-by-query
export async function getAllDealsByQuery(queries: FetchGetAllDealsByQueryType) {
  return handleAsync(() => fetchGetAllDealsByQuery(queries));
}
// get-all-deals-admin
export async function getAllDeals(queries: FetchGetAllDealsByQueryType) {
  return handleAsync(() => fetchGetAllDealsByQuery(queries));
}
// get-active-deal
export async function getActiveDeal(queries: handleGetActiveDealType) {
  return handleAsync(() => handleGetActiveDeal(queries));
}
// create-deal
export async function createDeal(queries: FetchCreateDealType) {
  return handleAsync(() => fetchCreateDeal(queries));
}
// update-deal
export async function updateDeal(data: Partial<addDealType>) {
  return handleAsync(() => fetchUpdateDeal(data));
}
// delete-deal
export async function deleteDeal(id: string) {
  return handleAsync(() => fetchDeleteDeal(id));
}
// deal-included
export async function hasIncludedDeal(queries: FetchHasIncludedDealType) {
  return handleAsync(() => fetchHasIncludedDeal(queries));
}
