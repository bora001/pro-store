"use client";
import { URLChanger } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export const useChangeURL = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const changeURL = (key: string, value: string) => {
    return URLChanger({
      pathname,
      params: params.toString(),
      key,
      value,
    });
  };
  return { changeURL };
};
