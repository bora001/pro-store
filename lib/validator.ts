import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (v) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(+v)),
    "Price must have exactly two decimal places"
  );

// product
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number().nonnegative(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  numReviews: z.number().nonnegative().default(0),
});

// update-product
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(3, "Id must be at least 3 characters long").optional(), // 🔥 id를 optional로 변경
});

// sign-in
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
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

// update-cart
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

// shipping
export const shippingSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  address: z.string().min(3, "Address must be at least 3 characters long"),
  city: z.string().min(3, "City must be at least 3 characters long"),
  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters long"),
  country: z.string().min(3, "Country must be at least 3 characters long"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// order
export const orderSchema = z.object({
  userId: z.string().min(3, "UserId must be at least 3 characters long"),
  payment: z.enum(PAYMENT_METHODS, {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  address: shippingSchema,
  itemPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
});

// orderItem
export const orderItemSchema = z.object({
  productId: z.string().min(3, "ProductId must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  image: z.string().min(3, "Image must be at least 3 characters long"),
  price: currency,
  qty: z.number().int().nonnegative("Quantity must be a positive integer"),
});

// payment
export const paymentSchema = z.object({
  type: z.enum(PAYMENT_METHODS, {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
});

// paypal-payment
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  pricePaid: z.string(),
  email_address: z.string(),
});

// user-profile
export const userProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
});

export const editUserSchema = userProfileSchema.extend({
  id: z.string().min(3, "ID must be at least 3 characters long"),
  role: z.string().min(3, "Role must be at least 3 characters long"),
});
