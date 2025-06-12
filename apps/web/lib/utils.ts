import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { PATH } from "./constants";

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

// capitalize
export const capitalize = (str: string) => str.length && str.charAt(0).toUpperCase() + str.slice(1);

// currency
export const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

// full date + time
export const dateTimeConverter = (time: Date | null) => {
  return dayjs(time).format("MMM DD, YYYY hh:mm A");
};

// handle error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  const isZodError = error.name === "ZodError";
  const isPrismaError = error.name === "PrismaClientKnownRequestError" && error.code === "P2002";
  let message = "";
  if (isZodError) {
    message = Object.keys(error.errors)
      .map((field) => {
        const { path, message } = error.errors[field];
        return `${path}[${message}]`;
      })
      .join(", ");
  } else if (isPrismaError) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    const errorFiled = field.charAt(0).toUpperCase() + field.slice(1);
    message = `${errorFiled} already exists`;
  } else {
    const err = error.message;
    message = typeof err === "string" ? err : JSON.stringify(err);
  }
  return {
    success: false,
    message,
    data: undefined,
  };
}

// handle success-response
export function formatSuccess<T>({ message, data }: { message?: string; data?: T }) {
  return { success: true, message, data };
}

// long-id-slicer
export function idSlicer(str: string, cut?: number) {
  return str.slice(-(cut || 10)).toUpperCase();
}

// url-query-changer
export function URLChanger({
  params,
  key,
  value,
  pathname,
}: {
  params: string;
  key: string;
  value: number | string;
  pathname?: string;
}) {
  const query = qs.parse(params);

  if (value === "" || value === undefined || value === null) delete query[key];
  else query[key] = String(value);
  return qs.stringifyUrl({ url: pathname || PATH.HOME, query }, { skipNull: true, skipEmptyString: true });
}

// calculate time
export const calculateTime = (endTime: string) => {
  const MILLISECONDS = { day: 1000 * 60 * 60 * 24, hour: 1000 * 60 * 60, minute: 1000 * 60, second: 1000 };
  const diff = +new Date(endTime) - +new Date();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / MILLISECONDS.day),
    hours: Math.floor((diff / MILLISECONDS.hour) % 24),
    minutes: Math.floor((diff / MILLISECONDS.minute) % 60),
    seconds: Math.floor((diff / MILLISECONDS.second) % 60),
  };
};

// local-date-time
export const toDatetimeLocalValue = (value: string | Date): string => {
  const date = new Date(value);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const [year, month, day, hours, minutes] = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
  ];

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
