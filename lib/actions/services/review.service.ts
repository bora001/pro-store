"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CONSTANTS, PATH } from "@/lib/constants";
import { addReviewSchema } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type handleAddOrEditReviewType = z.infer<typeof addReviewSchema>;

// add-edit-review
export async function handleAddOrEditReview(data: handleAddOrEditReviewType) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  const review = addReviewSchema.parse({ ...data, userId: session.user.id });
  const product = await prisma.product.findFirst({
    where: { id: review.productId },
  });
  if (!product) throw new Error("Product not found");
  const alreadyReviewed = await prisma.review.findFirst({
    where: {
      productId: review.productId,
      userId: review.userId,
    },
  });

  await prisma.$transaction(async (tx) => {
    if (alreadyReviewed) {
      await tx.review.update({
        where: { id: alreadyReviewed.id },
        data: {
          title: review.title,
          description: review.description,
          rating: review.rating,
        },
      });
    } else {
      await tx.review.create({ data: review });
    }
    const avgRating = await tx.review.aggregate({
      _avg: { rating: true },
      where: { productId: review.productId },
    });

    const reviewCount = await tx.review.count({
      where: { productId: review.productId },
    });

    await tx.product.update({
      where: { id: review.productId },
      data: {
        rating: avgRating._avg.rating || 0,
        numReviews: reviewCount,
      },
    });
  });

  revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
  return { message: "Review updated successfully" };
}

// get-all-reviews
export async function handleGetAllReviews(productId: string) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return { data };
}

// has-user-review-by-product
export async function handleHasUserReviewByProduct(productId: string) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  const data = await prisma.review.findFirst({
    where: { productId, userId: session.user.id },
  });
  return { data, message: "Successfully retrieved user's review" };
}

// delete-review
export async function handleDeleteReview(reviewId: string) {
  const data = await prisma.review.delete({
    where: { id: reviewId },
  });

  await prisma.$transaction(async (tx) => {
    const avgRating = await tx.review.aggregate({
      _avg: { rating: true },
      where: { productId: data.productId },
    });

    const reviewCount = await tx.review.count({
      where: { productId: data.productId },
    });

    await tx.product.update({
      where: { id: data.productId },
      data: {
        rating: avgRating._avg.rating || CONSTANTS.INIT_REVIEW_RATING,
        numReviews: reviewCount,
      },
    });
  });

  const product = await prisma.product.findFirst({
    where: { id: data.productId },
  });
  revalidatePath(`${PATH.PRODUCT}/${product?.slug}`);
  return { message: "Successfully deleted user's review" };
}

// has-purchase-history
export async function handleHasPurchaseHistory(productId: string) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  const hasPreviousOrder = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      orderItems: { some: { productId: productId } },
    },
  });
  if (!hasPreviousOrder) throw new Error("Review available after purchase");
  return { message: "Successfully retrieved user's history" };
}
