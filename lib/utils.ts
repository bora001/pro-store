import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

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
export const capitalize = (str: string) =>
  str.length && str.charAt(0).toUpperCase() + str.slice(1);

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
  const isPrismaError =
    error.name === "PrismaClientKnownRequestError" && error.code === "P2002";
  let message = "";
  if (isZodError) {
    message = Object.keys(error.errors)
      .map((field) => error.errors[field].message)
      .join(". ");
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
export function formatSuccess(message: string) {
  return {
    success: true,
    message,
  };
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

  if (value === "" || value === undefined || value === null) {
    delete query[key];
  } else {
    query[key] = String(value);
  }

  const currentPath = pathname || "/";

  return qs.stringifyUrl(
    { url: currentPath, query },
    { skipNull: true, skipEmptyString: true }
  );
}
