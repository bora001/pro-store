"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { Cart, CartItem } from "@/types";
import { cookies } from "next/headers";
import { prismaToJs } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";

const calcPrice = (item: CartItem[]) => {
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
};
export async function addItemToCart(data: CartItem, qty: number) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");

    const session = await auth();
    const userId = session?.user?.id || undefined;
    const cart = (await getMyCart()) as Cart;

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
        ...calcPrice([cartItem]),
      });
      await prisma.cart.create({ data: newCart });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${data.name} added to cart`,
      };
    } else {
      const existItem = cart.items.find(
        (prev: CartItem) => prev.productId === cartItem.productId
      );

      if (existItem) {
        if (product.stock < existItem.qty + qty)
          throw new Error("Not enough stock");
        existItem.qty = existItem.qty + qty;
      } else {
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push(cartItem);
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${data.name} ${existItem ? `updated` : `added`} to cart`,
      };
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
    return prismaToJs({
      ...cart,
      items: cart.items as CartItem[],
      itemPrice: cart.itemPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    });
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

export async function modifyItemQtyToCart(data: CartItem, qty: number) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");
    const cart = (await getMyCart()) as Cart;
    const cartItem = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });
    if (!product) throw new Error("Product not found");
    const existItem = cart.items.find(
      (prev: CartItem) => prev.productId === cartItem.productId
    );
    if (existItem) {
      if (product.stock < existItem.qty) {
        return {
          success: false,
          message: "Not enough stock",
        };
        // throw new Error("Not enough stock");
        //
      }
      existItem.qty = qty;
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${data.name} ${existItem ? `updated` : `added`} to cart`,
      };
    } else {
      return {
        success: false,
        message: `null`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error as string,
    };
  }
}

export async function removeItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");
    const cart = (await getMyCart()) as Cart;
    const cartItem = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });
    if (!product) throw new Error("Product not found");
    const existItem = cart.items.find(
      (prev: CartItem) => prev.productId === cartItem.productId
    );
    if (existItem) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items.filter((item) => item.productId !== data.productId),
          ...calcPrice(cart.items),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${data.name} is deleted to cart`,
      };
    } else {
      return {
        success: false,
        message: `null`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error as string,
    };
  }
}
