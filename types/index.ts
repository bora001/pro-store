import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
} from "@/lib/validator";
import { z } from "zod";

export type ProductItem = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
};
export type CartItem = z.infer<typeof cartItemSchema> & {};
