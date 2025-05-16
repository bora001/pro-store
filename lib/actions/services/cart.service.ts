"use server";

import { CartItemType } from "@/types";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { PATH } from "@/lib/constants";
import { checkSessionCardId, getUserInfo } from "../utils/session.utils";

export type HandleCartQueries = { data: CartItemType; qty: number };
type addItemToNewCartType = { sessionCartId: string; productId: string; qty: number };

// get-cart-id
export const getCartId = async () => {
  const [sessionCartId, userId] = await Promise.all([checkSessionCardId(), getUserInfo()]);
  const cart = await prisma.cart.findFirst({ where: { OR: [{ userId }, { sessionCartId }] }, select: { id: true } });
  return cart?.id;
};

// add-item-to-cart
const addItemToNewCart = async (data: addItemToNewCartType) => {
  const { sessionCartId, qty, productId } = data;
  await prisma.cart.create({ data: { sessionCartId, itemsCount: qty, items: { create: { productId, qty } } } });
};

const createNewCart = async (productId: string, qty: number, newPath: string, name: string) => {
  const sessionCartId = await checkSessionCardId();
  await addItemToNewCart({ sessionCartId, productId, qty });
  revalidatePath(newPath);
  return { message: `${name} added to cart`, success: true };
};

const updateExistCart = async ({ cartId, productId, qty }: { cartId: string; productId: string; qty: number }) => {
  await prisma.$transaction(async (tx) => {
    const [product, existingItem] = await Promise.all([
      tx.product.findUnique({ where: { id: productId }, select: { stock: true } }),
      tx.cartItem.findUnique({ where: { cartId_productId: { cartId, productId } }, select: { qty: true } }),
    ]);

    const currentQty = existingItem?.qty || 0;
    const newQty = currentQty + qty;
    if (!product || product.stock < newQty) throw new Error("Out of stock");

    await tx.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { qty: newQty },
      create: { cartId, productId, qty },
    });

    await tx.cart.update({ where: { id: cartId }, data: { itemsCount: { increment: qty } } });
  });
};

export const handleAddItemToCart = async ({ data, qty, cartId }: HandleCartQueries & { cartId?: string }) => {
  const { productId, name, slug } = data;
  const newPath = `${PATH.PRODUCT}/${slug}`;
  if (!cartId) return createNewCart(productId, qty, newPath, name);
  await updateExistCart({ cartId, productId, qty });
  revalidatePath(newPath);
  return { message: `${name} updated to cart` };
};

// get-cart
export const handleGetMyCart = async (id?: string) => {
  let sessionCartId = undefined;
  let userId = id || undefined;
  if (userId) sessionCartId = await checkSessionCardId();
  else {
    const [session, user] = await Promise.all([checkSessionCardId(), getUserInfo()]);
    sessionCartId = session;
    userId = user;
  }
  const cart = await prisma.cart.findFirst({
    where: { OR: [{ userId }, { sessionCartId }] },
    include: { items: { include: { product: true } } },
  });
  if (!cart) return { data: undefined };
  const cartItem = cart.items.map(({ product: { price, name, slug, images }, productId, qty }) => ({
    price,
    productId,
    qty,
    name,
    slug,
    image: images[0],
  }));

  return {
    data: {
      id: cart.id,
      userId: cart.userId,
      itemsCount: cart.itemsCount,
      sessionCartId: cart.sessionCartId,
      items: cartItem,
    },
  };
};

// remove-item-from-cart
export const handleRemoveItemToCart = async (data: CartItemType & { cartId: string }) => {
  const { cartId, productId, qty, name } = data;
  await prisma.$transaction(async (tx) => {
    await tx.cartItem.delete({ where: { cartId_productId: { cartId, productId } } });
    await tx.cart.update({ where: { id: cartId }, data: { itemsCount: { decrement: qty } } });
  });
  revalidatePath(PATH.CART);
  return { message: `${name} is deleted to cart` };
};

// modify-cart
export const handleModifyItemQtyToCart = async ({ data, qty, cartId }: HandleCartQueries & { cartId: string }) => {
  const { productId, name, slug, qty: currentQty } = data;
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id: data.productId }, select: { stock: true } });
    if (!product) throw new Error("Product not found");
    if (product.stock < qty) throw new Error("Out of stock");
    const qtyDifference = qty - currentQty;
    if (qty <= 0) {
      await tx.cartItem.delete({ where: { cartId_productId: { cartId, productId } } });
      await tx.cart.update({ where: { id: cartId }, data: { itemsCount: { decrement: currentQty } } });
    } else {
      await tx.cartItem.update({ where: { cartId_productId: { cartId, productId } }, data: { qty } });
      await tx.cart.update({ where: { id: cartId }, data: { itemsCount: { increment: qtyDifference } } });
    }
  });
  revalidatePath(`${PATH.PRODUCT}/${slug}`);
  return { message: `${name} quantity updated` };
};
