import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (v) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(+v)),
    "Price must have exactly two decimal places"
  );
// product
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// sign-in
export const signInSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// sign-up
export const signUpSchema = z
  .object({
    email: z.string().email("invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    name: z.string().min(3, "Username must be at least 3 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// cart
export const cartItemSchema = z.object({
  productId: z.string().min(3, "Product ID must be at least 3 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  qty: z.number().int().nonnegative("Quantity must be a positive integer"),
  image: z.string().min(3, "Image must be at least 3 characters long"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z
    .string()
    .min(3, "Session cart ID must be at least 3 characters long"),
  userId: z.string().optional().nullable(),
});
