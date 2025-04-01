"use client";
import { useChangeURL } from "@/hooks/use-change-url";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SORT_FILTER = ["newest", "lowest", "highest", "rating"];
const SortFilter = ({ sortBy }: { sortBy?: string }) => {
  const { changeURL } = useChangeURL();

  return (
    <div className="flex gap-2">
      <p>Sort by</p>
      {SORT_FILTER.map((sort) => (
        <Link
          key={sort}
          href={changeURL("sort", sort)}
          className={cn(sortBy === sort ? "font-bold" : "text-gray-500")}
        >
          {sort}
        </Link>
      ))}
    </div>
  );
};

export default SortFilter;
