"use server";

import { CartItemType } from "@/types";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { PATH } from "@/lib/constants";
import { checkSessionCardId, getUserInfo } from "../utils/session.utils";

export type HandleCartQueries = {
  data: CartItemType;
  qty: number;
};

// get-cart-id
export const getCartId = async () => {
  const [sessionCartId, userId] = await Promise.all([checkSessionCardId(), getUserInfo()]);
  const cart = await prisma.cart.findFirst({
    where: { OR: [{ userId: userId ?? undefined }, { sessionCartId }] },
    select: { id: true },
  });

  return cart?.id;
};

// add-item-to-cart
type addItemToNewCartType = {
  sessionCartId: string;
  productId: string;
  qty: number;
};
const addItemToNewCart = async (data: addItemToNewCartType) => {
  await prisma.cart.create({
    data: {
      sessionCartId: data.sessionCartId,
      itemsCount: 1,
      items: {
        create: {
          productId: data.productId,
          qty: data.qty,
        },
      },
    },
  });
};
const createNewCart = async (productId: string, qty: number, newPath: string, name: string) => {
  const sessionCartId = await checkSessionCardId();
  await addItemToNewCart({
    sessionCartId,
    productId,
    qty,
  });

  revalidatePath(newPath);
  return { message: `${name} added to cart`, success: true };
};

export const handleAddItemToCart = async ({ data, qty, cartId }: HandleCartQueries & { cartId?: string }) => {
  const newPath = `${PATH.PRODUCT}/${data.slug}`;
  if (!cartId) return createNewCart(data.productId, qty, newPath, data.name);

  await prisma.$transaction(async (tx) => {
    const [product, existingItem] = await Promise.all([
      tx.product.findUnique({
        where: { id: data.productId },
        select: { stock: true },
      }),
      tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId,
            productId: data.productId,
          },
        },
        select: { qty: true },
      }),
    ]);

    const currentQty = existingItem?.qty || 0;
    const newQty = currentQty + qty;

    if (!product || product.stock < newQty) throw new Error("Out of stock");

    await tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId: data.productId,
        },
      },
      update: { qty: newQty },
      create: {
        cartId,
        productId: data.productId,
        qty,
      },
    });

    await tx.cart.update({
      where: { id: cartId },
      data: { itemsCount: { increment: qty } },
    });
  });

  revalidatePath(newPath);
  return { message: `${data.name} updated to cart` };
};

// get-cart
export const handleGetMyCart = async (id?: string) => {
  let sessionCartId = undefined;
  let userId = id || undefined;
  if (userId) {
    sessionCartId = await checkSessionCardId();
  } else {
    const [session, user] = await Promise.all([checkSessionCardId(), getUserInfo()]);
    sessionCartId = session;
    userId = user;
  }
  const cart = await prisma.cart.findFirst({
    where: { OR: [{ userId: userId }, { sessionCartId }] },
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
  await prisma.$transaction(async (tx) => {
    await tx.cartItem.delete({
      where: { cartId_productId: { cartId: data.cartId, productId: data.productId } },
    });
    await tx.cart.update({
      where: { id: data.cartId },
      data: { itemsCount: { decrement: data.qty } },
    });
  });
  revalidatePath(PATH.CART);
  return { message: `${data.name} is deleted to cart` };
};

// modify-cart
export const handleModifyItemQtyToCart = async ({ data, qty, cartId }: HandleCartQueries & { cartId: string }) => {
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: { id: data.productId },
      select: { stock: true },
    });
    if (!product) throw new Error("Product not found");
    if (product.stock < qty) throw new Error("Out of stock");
    const qtyDifference = qty - data.qty;
    if (qty <= 0) {
      await tx.cartItem.delete({
        where: { cartId_productId: { cartId, productId: data.productId } },
      });
      await tx.cart.update({
        where: { id: cartId },
        data: { itemsCount: { decrement: data.qty } },
      });
    } else {
      // Update item quantity
      await tx.cartItem.update({
        where: { cartId_productId: { cartId, productId: data.productId } },
        data: { qty },
      });
      // Update cart count
      await tx.cart.update({
        where: { id: cartId },
        data: { itemsCount: { increment: qtyDifference } },
      });
    }
  });
  revalidatePath(`${PATH.PRODUCT}/${data.slug}`);
  return { message: `${data.name} quantity updated` };
};
