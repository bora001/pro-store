"use server";

import { handleAsync } from "@/utils/handle-async";
import { handleAllCategory, handleBanner } from "../services/home.service";

// get-all-category
export async function getAllCategory() {
  return handleAsync(handleAllCategory);
}
// get-banner
export async function getBanner() {
  return handleAsync(handleBanner);
}
