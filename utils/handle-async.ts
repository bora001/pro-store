"use server";
import { formatError, formatSuccess } from "@/lib/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * Handles async function execution with a unified error format.
 * Useful for API handlers or server actions.
 */

export type AsyncReturn<T> = Promise<{ data?: T; message?: string }>;

export async function handleAsync<T>(fn: () => AsyncReturn<T>) {
  try {
    const { data, message } = await fn();
    return formatSuccess({ message, data });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return formatError(error);
  }
}
