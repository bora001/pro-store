import { CHAT_ROLE, MANUAL_QUESTIONS, PAYMENT_METHODS } from "@/lib/constants";
import { TypesenseProductByTag } from "@/lib/typesense/product-by-tag/search-product-by-tag";
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

// schema
export type InsertProductSchemaType = z.infer<typeof insertProductSchema>;
export type ProductItemType = InsertProductSchemaType & {
  id: string;
  rating: string;
  createdAt: Date;
  Deal: addDealType[];
};

export type CartType = z.infer<typeof insertCartSchema> & { id: string };

export type OrderType = z.infer<typeof orderSchema> & {
  id: string;
  createdAt: Date;
  paidAt: Date | null;
  deliveredAt: Date | null;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: OrderItemType[];
  user: { name: string; email: string };
  paymentResult: PaymentResultType;
};
export type CartItemType = z.infer<typeof cartItemSchema> & { InStock?: boolean };
export type ShippingSchemaType = z.infer<typeof shippingSchema>;
export type OrderItemType = z.infer<typeof orderItemSchema> & { dealInfo?: addDealType | null };
export type PaymentResultType = z.infer<typeof paymentResultSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type userProfileType = z.infer<typeof userProfileSchema>;
export type ResponseType<T = unknown> = { success: boolean; message?: string; data: T };
export type PaymentType = (typeof PAYMENT_METHODS)[number];
export type updateProductType = z.infer<typeof updateProductSchema>;
export type EditUserSchemaType = z.infer<typeof editUserSchema>;
export type CategoryType = { category: string; count: number };

export type AddReviewSchemaType = z.infer<typeof addReviewSchema>;
export type reviewType = AddReviewSchemaType & { id: string; createdAt: Date; user?: { name: string } };

export type AddDealSchemaType = z.infer<typeof addDealSchema>;
export type addDealType = AddDealSchemaType & { id: string; product?: ProductItemType };
export type getDealType = AddDealSchemaType & {
  product?: Omit<
    ProductItemType,
    "category" | "brand" | "description" | "isFeatured" | "banner" | "numReviews" | "rating" | "createdAt" | "Deal"
  > & { Deal?: { title: string }[] };
};

// pages
type pageInformation = { count: number; totalPages: number };

// result
export type AdminDealType = AddDealSchemaType & { id: string; product: Pick<ProductItemType, "name"> };

export interface AdminProductResult extends pageInformation {
  product: Pick<ProductItemType, "id" | "name" | "price" | "category" | "stock" | "rating">[];
}
export interface AdminDealResult extends pageInformation {
  deal: AdminDealType[];
}

export type TagType = { id: string; name: string };

// chat
export type ChatRoleType = (typeof CHAT_ROLE)[keyof typeof CHAT_ROLE];
export type DefaultQuestionKeyType = keyof typeof MANUAL_QUESTIONS;

type DefaultQuestionType = { [key in DefaultQuestionKeyType]: { question: string; answer: string } };

export type Message =
  | ({
      role: Extract<ChatRoleType, "user" | "assistant">;
      content: string;
    } & { entry?: never; data?: never })
  | ({
      role: Extract<ChatRoleType, "default">;
      entry: DefaultQuestionType;
    } & { content?: never; data?: never })
  | ({
      role: Extract<ChatRoleType, "recommendations">;
      data: TypesenseProductByTag[];
      content: string;
    } & { entry?: never });

export type SettingKeyType = "manual" | "prompt" | "recommendation";
