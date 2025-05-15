"use server";

import { handleAsync } from "@/utils/handle-async";
import {
  handleAddOrEditReview,
  handleAddOrEditReviewType,
  handleDeleteReview,
  handleGetAllReviews,
  handleHasPurchaseHistory,
  handleHasUserReviewByProduct,
} from "../services/review.service";

// add-edit-review
export async function addOrEditReview(data: handleAddOrEditReviewType) {
  return handleAsync(() => handleAddOrEditReview(data));
}
// get-all-reviews
export async function getAllReviews(productId: string) {
  return handleAsync(() => handleGetAllReviews(productId));
}
// has-user-review-by-product
export async function hasUserReviewByProduct(productId: string) {
  return handleAsync(() => handleHasUserReviewByProduct(productId));
}
// delete-review
export async function deleteReview(reviewId: string) {
  return handleAsync(() => handleDeleteReview(reviewId));
}
// has-purchase-history
export async function hasPurchaseHistory(productId: string) {
  return handleAsync(() => handleHasPurchaseHistory(productId));
}
