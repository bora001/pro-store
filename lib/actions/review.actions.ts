"use server";

import { formatError, formatSuccess } from "../utils";
import { CONSTANTS, PATH } from "../constants";
import { prisma } from "@/db/prisma";
import { z } from "zod";
import { addReviewSchema } from "../validator";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// add-review
export async function addOrEditReview(data: z.infer<typeof addReviewSchema>) {
  try {
    const session = await auth();
    if (!session) throw new Error("Not authenticated");
    const review = addReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });
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
          where: {
            id: alreadyReviewed.id,
          },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }
      const avgRating = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      });

      const reviewCount = await tx.review.count({
        where: {
          productId: review.productId,
        },
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
    return formatSuccess("Review updated successfully");
  } catch (error) {
    return formatError(error);
  }
}

// get-all-reviews
export async function getAllReviews(productId: string) {
  const data = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { data };
}

// has-user-review-by-product
export async function hasUserReviewByProduct(productId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("Not authenticated");
    const data = await prisma.review.findFirst({
      where: {
        productId,
        userId: session.user.id,
      },
    });
    return {
      data,
      success: true,
      message: "Successfully retrieved user's review",
    };
  } catch (error) {
    return formatError(error);
  }
}

// delete-review
export async function deleteReview(reviewId: string) {
  try {
    const data = await prisma.review.delete({
      where: {
        id: reviewId,
      },
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
    return formatSuccess("Successfully deleted user's review");
  } catch (error) {
    return formatError(error);
  }
}

// has-purchase-history
export async function hasPurchaseHistory(productId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("Not authenticated");
    const hasPreviousOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        orderItems: {
          some: {
            productId: productId,
          },
        },
      },
    });
    if (!hasPreviousOrder) throw new Error("Review available after purchase");
    return formatSuccess("Successfully retrieved user's history");
  } catch (error) {
    return formatError(error);
  }
}
