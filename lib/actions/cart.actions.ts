"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { formatError, formatSuccess, prismaToJs } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { PATH } from "../constants";

export async function calcPrice(item: CartItem[]) {
  const itemPrice = item.reduce((acc, item) => {
    return acc + +item.price * item.qty;
  }, 0);
  const shippingPrice = itemPrice > 100 ? 0 : 10;
  const taxPrice = +(itemPrice * 0.15).toFixed(2);
  const totalPrice = itemPrice + shippingPrice + taxPrice;
  return {
    itemPrice: String(itemPrice),
    shippingPrice: String(shippingPrice),
    taxPrice: String(taxPrice),
    totalPrice: String(totalPrice),
  };
}
export async function addItemToCart(data: CartItem, qty: number) {
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
    if (!product) throw new Error("Product not found");
    if (!cart) {
      cartItem.qty = qty;
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [cartItem],
        ...(await calcPrice([cartItem])),
      });
      await prisma.cart.create({ data: newCart });
      revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
      return formatSuccess(`${data.name} added to cart`);
    } else {
      const existItem = cart.data?.items.find(
        (prev: CartItem) => prev.productId === cartItem.productId
      );

      if (existItem) {
        if (product.stock < existItem.qty + qty)
          throw new Error("Not enough stock");
        existItem.qty = existItem.qty + qty;
      } else {
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.data?.items.push(cartItem);
      }
      await prisma.cart.update({
        where: { id: cart.data?.id },
        data: {
          items: cart.data?.items,
          ...(await calcPrice(cart.data?.items || [])),
        },
      });
      revalidatePath(`${PATH.PRODUCT}/${product.slug}`);
      return formatSuccess(
        `${data.name} ${existItem ? `updated` : `added`} to cart`
      );
    }
  } catch (error) {
    return {
      success: false,
      message: error as string,
    };
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
    return {
      success: true,
      data: prismaToJs({
        ...cart,
        items: cart.items as CartItem[],
        itemPrice: cart.itemPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
      }),
    };
  } catch (error) {
    return formatError(error);
  }
}

export async function modifyItemQtyToCart(data: CartItem, qty: number) {
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
      (prev: CartItem) => prev.productId === cartItem.productId
    );
    if (existItem) {
      if (product.stock < existItem.qty) {
        return formatSuccess("Not enough stock");
      }
      existItem.qty = qty;
      await prisma.cart.update({
        where: { id: cart?.data?.id },
        data: {
          items: cart?.data?.items,
          ...(await calcPrice(cart?.data?.items || [])),
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

export async function removeItemToCart(data: CartItem) {
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
      (prev: CartItem) => prev.productId === cartItem.productId
    );
    if (existItem) {
      await prisma.cart.update({
        where: { id: cart?.data?.id },
        data: {
          items: cart?.data?.items.filter(
            (item) => item.productId !== data.productId
          ),
          ...(await calcPrice(cart?.data?.items || [])),
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
