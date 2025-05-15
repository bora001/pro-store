import { auth } from "@/auth";
import { cookies } from "next/headers";

export const getUserInfo = async () => {
  const session = await auth();
  const userId = session?.user?.id || undefined;
  return userId;
};

export const checkSessionCardId = async () => {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Session cart not found");
  return sessionCartId;
};
