"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItemType } from "@/types";
import { cookies } from "next/headers";
import { formatError, formatSuccess, prismaToJs } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { PATH } from "../constants";

export async function addItemToCart(data: CartItemType, qty: number) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");

    const session = await auth();
    const userId = session?.user?.id || undefined;
    const cart = await getMyCart();

    const cartItem = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });
    const deal = await prisma.deal.findFirst({
      where: {
        productId: cartItem.productId,
      },
    });

    if (!product) throw new Error("Product not found");
    if (!cart) {
      cartItem.qty = qty;
      cartItem.discount = deal?.discount;
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [cartItem],
        itemsCount: qty,
      });
      await prisma.cart.create({
        data: newCart,
      });
      revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
      return formatSuccess(`${data.name} added to cart`);
    } else {
      const existItem = cart.data?.items.find(
        (prev: CartItemType) => prev.productId === cartItem.productId
      );

      if (existItem) {
        if (product.stock < existItem.qty + qty)
          throw new Error("Can't add more of this item");
        existItem.qty = existItem.qty + qty;
        existItem.discount = deal?.discount;
      } else {
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.data?.items.push(cartItem);
      }
      const itemsCount = cart.data?.items.reduce(
        (acc, cur) => acc + cur.qty,
        0
      );
      await prisma.cart.update({
        where: { id: cart.data?.id },
        data: {
          items: cart.data?.items,
          itemsCount,
        },
      });
      revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
      return formatSuccess(
        `${data.name} ${existItem ? `updated` : `added`} to cart`
      );
    }
  } catch (error) {
    return formatError(error);
  }
}

export async function getMyCart() {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");
    const session = await auth();
    const userId = session?.user?.id || undefined;
    const cart = await prisma.cart.findFirst({
      where: userId
        ? { userId }
        : {
            sessionCartId,
          },
    });

    if (!cart) return undefined;
    const cartItem = cartItemSchema.array().parse(cart.items);
    const items = await Promise.all(
      cartItem.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        const InStock = !!product && product.stock >= item.qty;
        return {
          ...item,
          qty: InStock ? item.qty : 0,
        };
      })
    );

    return {
      success: true,
      data: prismaToJs({
        ...cart,
        items,
      }),
    };
  } catch (error) {
    return formatError(error);
  }
}

export async function modifyItemQtyToCart(data: CartItemType, qty: number) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");
    const cart = await getMyCart();
    const cartItem = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });
    if (!product) throw new Error("Product not found");
    const existItem = cart?.data?.items.find(
      (prev: CartItemType) => prev.productId === cartItem.productId
    );
    if (existItem) {
      if (product.stock < existItem.qty + qty) {
        return formatSuccess("Can't add more of this item");
      }
      existItem.qty = qty;
      await prisma.cart.update({
        where: { id: cart?.data?.id },
        data: {
          items: cart?.data?.items,
          itemsCount:
            cart?.data?.items.reduce((acc, item) => acc + item.qty, 0) || 0,
        },
      });
      revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
      return formatSuccess(
        `${data.name} ${existItem ? `updated` : `added`} to cart`
      );
    } else {
      return {
        success: false,
        message: `null`,
      };
    }
  } catch (error) {
    return formatError(error);
  }
}

export async function removeItemToCart(data: CartItemType) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");
    const cart = await getMyCart();
    const cartItem = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });
    if (!product) throw new Error("Product not found");
    const existItem = cart?.data?.items.find(
      (prev: CartItemType) => prev.productId === cartItem.productId
    );
    if (existItem) {
      await prisma.cart.update({
        where: { id: cart?.data?.id },
        data: {
          items: cart?.data?.items.filter(
            (item) => item.productId !== data.productId
          ),
        },
      });
      revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
      return formatSuccess(`${data.name} is deleted to cart`);
    } else {
      return {
        success: false,
        message: `null`,
      };
    }
  } catch (error) {
    return formatError(error);
  }
}
