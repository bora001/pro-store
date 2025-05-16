"use server";

import { CartItemType } from "@/types";
import { getMyCart } from "../handler/cart.actions";
import { cartItemSchema, insertCartSchema } from "@/lib/validator";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { PATH } from "@/lib/constants";
import { prismaToJs } from "@/lib/utils";
import { checkSessionCardId, getUserInfo } from "../utils/session.utils";
import { z } from "zod";

export type HandleCartQueries = {
  data: CartItemType;
  qty: number;
};

// add-item-to-cart
type addItemToNewCartType = {
  userId?: string;
  sessionCartId: string;
  items: CartItemType[];
  itemsCount: number;
};
const addItemToNewCart = async (data: addItemToNewCartType) => {
  const newCart = insertCartSchema.parse(data);
  await prisma.cart.create({
    data: newCart,
  });
};

type AddItemToExistingCartDataType = {
  previousStock: number;
  cartItems: z.infer<typeof cartItemSchema>[];
  cartItem: z.infer<typeof cartItemSchema>;
  qty: number;
  id?: string;
  discount?: number;
};

const addItemToExistingCart = async ({
  previousStock,
  cartItems,
  cartItem,
  qty,
  id,
  discount,
}: AddItemToExistingCartDataType) => {
  const existItem = cartItems.find((prev: CartItemType) => prev.productId === cartItem.productId);
  if (existItem) {
    if (previousStock < existItem.qty + qty) throw new Error("Can't add more of this item");
    existItem.qty = existItem.qty + qty;
    existItem.discount = discount;
  } else {
    if (previousStock < 1) throw new Error("Not enough stock");
    cartItems.push({ ...cartItem, qty });
  }
  await prisma.cart.update({
    where: { id },
    data: {
      items: cartItems,
      itemsCount: cartItems.reduce((acc, cur) => acc + cur.qty, 0),
    },
  });
  return existItem;
};

export const handleAddItemToCart = async ({ data, qty }: HandleCartQueries) => {
  const sessionCartId = await checkSessionCardId();
  const userId = await getUserInfo();
  const cart = await getMyCart();
  const cartItem = cartItemSchema.parse(data);
  const product = await prisma.product.findFirst({
    where: { id: cartItem.productId },
  });
  if (!product) throw new Error("Product not found");
  const deal = await prisma.deal.findFirst({
    where: {
      productId: cartItem.productId,
    },
  });
  const newPath = `${PATH.PRODUCT}/${product.slug}`;
  if (!cart) {
    await addItemToNewCart({
      userId,
      sessionCartId,
      items: [{ ...cartItem, qty, discount: deal?.discount }],
      itemsCount: qty,
    });
    revalidatePath(newPath);
    return { message: `${data.name} added to cart` };
  } else {
    const item = {
      previousStock: product.stock,
      cartItems: cart.data?.items || [],
      qty,
      id: cart.data?.id,
      cartItem,
      discount: deal?.discount,
    };
    const existItem = await addItemToExistingCart(item);
    revalidatePath(newPath);
    return {
      message: `${data.name} ${existItem ? `updated` : `added`} to cart`,
    };
  }
};
// get-cart
export const handleGetMyCart = async () => {
  const sessionCartId = await checkSessionCardId();
  const userId = await getUserInfo();
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });
  if (!cart) return { data: undefined };
  const cartItem = cartItemSchema.array().parse(cart.items);
  const items = await Promise.all(
    cartItem.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      const InStock = !!product && product.stock >= item.qty;
      return { ...item, qty: InStock ? item.qty : 0 };
    })
  );
  return {
    data: prismaToJs({ ...cart, items }),
  };
};

// modify-cart
export const handleModifyItemQtyToCart = async ({ data, qty }: HandleCartQueries) => {
  await checkSessionCardId();
  const cart = await getMyCart();
  const product = await prisma.product.findFirst({
    where: { id: data.productId },
  });
  if (!product) throw new Error("Product not found");

  const existItem = cart?.data?.items.find((prev: CartItemType) => prev.productId === data.productId);
  if (!existItem) throw new Error("Item is not in cart");
  if (product.stock < qty) return { message: "Can't add more of this item" };

  existItem.qty = qty;
  await prisma.cart.update({
    where: { id: cart?.data?.id },
    data: {
      items: cart?.data?.items,
      itemsCount: cart?.data?.items.reduce((acc, item) => acc + item.qty, 0) || 0,
    },
  });

  revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
  return {
    message: `${data.name} ${existItem ? `updated` : `added`} to cart`,
  };
};
// remove-item-from-cart
export const handleRemoveItemToCart = async (data: CartItemType) => {
  await checkSessionCardId();
  const cart = await getMyCart();
  const cartItem = cartItemSchema.parse(data);
  const product = await prisma.product.findFirst({
    where: { id: cartItem.productId },
  });
  if (!product) throw new Error("Product not found");
  const existItem = cart?.data?.items.find((prev: CartItemType) => prev.productId === cartItem.productId);
  if (!existItem) throw new Error("Item is not in cart");
  await prisma.cart.update({
    where: { id: cart?.data?.id },
    data: {
      items: cart?.data?.items.filter((item) => item.productId !== data.productId),
    },
  });
  revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
  return { message: `${data.name} is deleted to cart` };
};
