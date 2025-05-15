"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { PATH } from "@/lib/constants";
import {
  sendDeleteAccountConfirm,
  sendWelcomeEmail,
} from "@/lib/email/mail-handler";
import { shippingSchema, signInSchema } from "@/lib/validator";
import {
  ShippingType,
  editUserType,
  signUpInfo,
  userProfileType,
} from "@/types";
import { hashSync } from "bcrypt-ts-edge";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { getUserInfo } from "../utils/session.utils";
// sign-up
export const handleSignUpUser = async (user: signUpInfo) => {
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashSync(user.password, 10),
    },
  });
  if (!newUser) throw new Error("Sign up failed");
  await sendWelcomeEmail({ name: user.name, email: user.email });
  await signIn("credentials", { email: user.email, password: user.password });
  return { message: "Signed up successfully" };
};

// sign-in
export const handleSignInUser = async (_: unknown, formData: FormData) => {
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
};
// sign-out
export const handleSignOutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("sessionCartId");
  await signOut();
  return { message: "Signed out successfully" };
};

// check-duplicate-email
export const handleCheckDuplicateEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    throw new Error("Email already exists");
  } else {
    return { message: "Email is valid" };
  }
};

// get-user
export const handleGetUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
  });
  if (!user) throw new Error("User not found");
  return { data: user };
};

// update-address
export const handleUpdateUserAddress = async (data: ShippingType) => {
  const id = await getUserInfo();
  const currentUser = await prisma.user.findFirst({
    where: { id },
  });
  if (!currentUser) throw new Error("User not found");
  const address = shippingSchema.parse(data);
  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: { address },
  });
  return { message: "User Address updated successfully" };
};

// update-user-profile
export const handleUpdateUserProfile = async (data: userProfileType) => {
  const id = await getUserInfo();
  const currentUser = await prisma.user.findFirst({
    where: { id },
  });
  if (!currentUser) throw new Error("User not found");
  await prisma.user.update({
    where: { id: currentUser.id },
    data,
  });
  return { message: "User profile is updated successfully" };
};

// edit-user-profile-by-admin
export const handleEditUserProfile = async (data: editUserType) => {
  await prisma.user.update({
    where: { id: data.id },
    data,
  });
  return { message: "User is edited successfully" };
};

// delete-user
export const handleDeleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath(PATH.USERS);
  return { message: "User is deleted successfully" };
};

// delete-user-account
export const handleDeleteUserAccount = async (id: string) => {
  const data = await prisma.user.delete({
    where: { id },
  });
  await sendDeleteAccountConfirm({ email: data.email, name: data.name });
  await signOut({ redirect: false });
  return { message: "User is deleted successfully" };
};
