import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import NodemailerProvider from "@auth/core/providers/nodemailer";

import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { PATH } from "./lib/constants";

type User = { id: string; name: string; email: string; role: string };

export const config = {
  pages: { signIn: PATH.SIGN_IN, error: PATH.SIGN_IN },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
  providers: [
    NodemailerProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),

    CredentialsProvider({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials): Promise<User | null> {
        if (credentials === null) return null;
        const user = await prisma.user.findFirst({ where: { email: credentials.email as string } });
        if (!user || !user.password) return null;
        const { id, name, email, role, password } = user;
        const isMatch = compareSync(credentials.password as string, password);
        if (!isMatch) return null;
        return { id, name, email, role };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      if (trigger === "update") session.user.name = user.name;
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
        if (trigger === "signIn" || trigger === "signUp") {
          const sessionCartId = (await cookies()).get("sessionCartId")?.value;
          await prisma.$transaction(async (tx) => {
            const existingCart = await tx.cart.findFirst({ where: { userId: user.id }, include: { items: true } });
            const sessionCart = await tx.cart.findFirst({ where: { sessionCartId }, include: { items: true } });

            if (!sessionCart) return token;
            if (existingCart) {
              // Merge sessionCart items into existingCart
              for (const sessionItem of sessionCart.items) {
                const existingItem = existingCart.items.find((item) => item.productId === sessionItem.productId);

                if (existingItem) {
                  await tx.cartItem.update({
                    where: {
                      cartId_productId: {
                        cartId: existingCart.id,
                        productId: sessionItem.productId,
                      },
                    },
                    data: { qty: existingItem.qty + sessionItem.qty },
                  });
                } else {
                  // Add new item
                  await tx.cartItem.create({
                    data: {
                      cartId: existingCart.id,
                      productId: sessionItem.productId,
                      qty: sessionItem.qty,
                    },
                  });
                }
              }

              // Delete session cart
              await tx.cart.delete({ where: { id: sessionCart.id } });
            } else {
              await tx.cart.update({ where: { id: sessionCart.id }, data: { userId: user.id } });
            }
          });
        }
      }

      if (session?.user.name && trigger === "update") token.name = session.user.name;
      if (session?.user.email && trigger === "update") token.email = session.user.email;

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
