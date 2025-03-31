"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { URLChanger } from "@/lib/utils";

type PaginationPropsType = {
  page: number | string;
  totalPages: number;
  urlParams?: string;
};
const Pagination = ({ page, totalPages, urlParams }: PaginationPropsType) => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const handlePagination = (type: string) => {
    const pageValue = +page + (type === "prev" ? -1 : +1);
    const newURL = URLChanger({
      params: params.toString(),
      pathname,
      key: urlParams || "",
      value: pageValue || 1,
    });
    router.push(newURL);
  };
  return (
    <div className="flex gap-2">
      <Button
        disabled={+page === 1}
        variant="outline"
        onClick={() => handlePagination("prev")}
      >
        <ChevronLeft />
      </Button>
      <Button
        disabled={+page === totalPages}
        variant="outline"
        onClick={() => handlePagination("next")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;
