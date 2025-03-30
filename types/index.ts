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
} from "@/lib/validator";
import { z } from "zod";

export type USER_ROLE = "admin" | "user";

export type ProductItem = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
};
export type CartItem = z.infer<typeof cartItemSchema> & {};
export type Shipping = z.infer<typeof shippingSchema>;
export type Order = z.infer<typeof orderSchema> & {
  id: string;
  createdAt: Date;
  paidAt: Date | null;
  deliveredAt: Date | null;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: OrderItem[];
  user: {
    name: string;
    email: string;
  };
};
export type OrderItem = z.infer<typeof orderItemSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type userProfile = z.infer<typeof userProfileSchema>;
export type ResponseType = { success: boolean; message: string };
export type PaymentType = (typeof PAYMENT_METHODS)[number];
