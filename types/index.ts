import { PAYMENT_METHODS } from "@/lib/constants";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingSchema,
  orderSchema,
  orderItemSchema,
  paymentResultSchema,
  userProfileSchema,
  updateProductSchema,
  editUserSchema,
  addReviewSchema,
  addDealSchema,
  signUpSchema,
} from "@/lib/validator";
import { Product } from "@prisma/client";
import { z } from "zod";

export type BannerType = Pick<Product, "id" | "slug" | "banner">;

export type ProductItemType = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
  Deal: addDealType[];
};

export type CartType = z.infer<typeof insertCartSchema> & {
  id: string;
};

export type OrderType = z.infer<typeof orderSchema> & {
  id: string;
  createdAt: Date;
  paidAt: Date | null;
  deliveredAt: Date | null;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: OrderItemType[];
  user: {
    name: string;
    email: string;
  };
  paymentResult: PaymentResultType;
};
export type CartItemType = z.infer<typeof cartItemSchema> & {
  InStock?: boolean;
};
export type ShippingType = z.infer<typeof shippingSchema>;
export type OrderItemType = z.infer<typeof orderItemSchema> & {
  dealInfo?: addDealType | null;
};
export type PaymentResultType = z.infer<typeof paymentResultSchema>;
export type signUpInfo = z.infer<typeof signUpSchema>;
export type userProfileType = z.infer<typeof userProfileSchema>;
export type ResponseType = { success: boolean; message: string };
export type PaymentType = (typeof PAYMENT_METHODS)[number];
export type updateProductType = z.infer<typeof updateProductSchema>;
export type editUserType = z.infer<typeof editUserSchema>;
export type CategoryType = {
  category: string;
  count: number;
};
export type reviewType = z.infer<typeof addReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: {
    name: string;
  };
};

export type addDealType = z.infer<typeof addDealSchema> & {
  id: string;
  product?: ProductItemType;
};
export type getDealType = z.infer<typeof addDealSchema> & {
  product?: Omit<
    ProductItemType,
    | "category"
    | "brand"
    | "description"
    | "isFeatured"
    | "banner"
    | "numReviews"
    | "rating"
    | "createdAt"
    | "Deal"
  > & {
    Deal?: { title: string }[];
  };
};
