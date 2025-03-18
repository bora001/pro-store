import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// prisma-object to js-object
export function prismaToJs<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// format number with decimal
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toFixed(2).split(".");
  return decimal ? `${int}.${decimal}` : `${int}.00`;
}

// divide by decimal
export function divideByDecimal(num: number) {
  const [int, decimal] = num.toFixed(2).split(".");
  return decimal ? [int, decimal.padEnd(2, "0")] : [int, "00"];
}

// to title case
export const toTitleCase = (str: string) =>
  str.length && str.charAt(0).toUpperCase() + str.slice(1);
