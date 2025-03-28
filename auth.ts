import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { CartItem } from "./types";
import { calcPrice } from "./lib/actions/cart.actions";
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};
export const config = {
  pages: { signIn: "sign-in", error: "sign-in" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials): Promise<User | null> {
        if (credentials === null) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const isMatch = compareSync(
          credentials.password as string,
          user.password
        );
        if (!isMatch) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.name === "NO_NAME") token.name = user.email.split("@")[0];
        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name },
        });
        if (trigger === "signIn" || trigger === "signUp") {
          const cookieObj = await cookies();
          const sessionCartId = cookieObj.get("sessionCartId")?.value;
          if (sessionCartId) {
            const existingCart = await prisma.cart.findFirst({
              where: { userId: user.id },
            });

            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
            if (!sessionCart) return;
            if (existingCart) {
              const updatedItems = [...existingCart.items] as CartItem[];
              // merge into existing cart
              for (const sessionItem of sessionCart.items as CartItem[]) {
                const existItemIndex = updatedItems.findIndex(
                  (item: CartItem) => item.productId === sessionItem?.productId
                );

                if (existItemIndex >= 0) {
                  // qty up
                  updatedItems[existItemIndex].qty += sessionItem.qty;
                } else {
                  // add
                  updatedItems.push(sessionItem);
                }
              }
              // update existing cart by merged item
              await prisma.cart.update({
                where: { id: existingCart.id },
                data: {
                  items: updatedItems,
                  ...(await calcPrice(updatedItems)),
                },
              });
              // delete sessionCart
              await prisma.cart.delete({
                where: { id: sessionCart.id },
              });
            } else {
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
