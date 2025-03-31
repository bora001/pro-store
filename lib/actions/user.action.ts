"use server";

import { shippingSchema, signInSchema, signUpSchema } from "../validator";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { Shipping, userProfile } from "@/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { formatError, formatSuccess } from "../utils";

// sign-in
export async function signInUser(prevState: unknown, formData: FormData) {
  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: "Invalid email or password",
      data: { email: formData.get("email") },
    };
  }
}

// sign-out
export async function signOutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("sessionCartId");
  await signOut();
  return formatSuccess("Signed out successfully");
}

// sign-up
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashSync(user.password, 10),
      },
    });
    await signIn("credentials", { email: user.email, password: user.password });
    return formatSuccess("Signed up successfully");
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
    };
    if (error instanceof ZodError && error?.name === "ZodError")
      return { success: false, message: error?.errors[0].message, data };
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.name === "PrismaClientKnownRequestError" &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: `${error.meta?.target} already exists`,
        data,
      };
    }
    return {
      success: false,
      message: "Sign up failed",
      data,
    };
  }
}

// get-user
export async function getUserById(id: string) {
  const user = await prisma.user.findFirst({
    where: { id },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// update-address
export async function updateUserAddress(data: Shipping) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error("User not found");
    const address = shippingSchema.parse(data);
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: { address },
    });
    return formatSuccess("User Address updated successfully");
  } catch (error) {
    return formatError(error);
  }
}

// update-user-profile
export async function updateUserProfile(data: userProfile) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");
    await prisma.user.update({
      where: { id: currentUser.id },
      data,
    });
    return formatSuccess("User profile is updated successfully");
  } catch (error) {
    return formatError(error);
  }
}
