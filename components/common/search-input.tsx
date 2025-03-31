"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { URLChanger } from "@/lib/utils";

const SearchInput = ({ query = "" }: { query: string }) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState(query);
  const params = useSearchParams();
  const pathname = usePathname();
  const newURL = URLChanger({
    params: params.toString(),
    pathname,
    key: "query",
    value: searchKeyword,
  });

  useEffect(() => {
    setSearchKeyword(query);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.replace(newURL);
    }
  };

  return (
    <div className="flex">
      <Input
        value={searchKeyword}
        placeholder="Search"
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      <Link
        href={newURL}
        className="bg-black px-3 flex items-center justify-center rounded-sm"
      >
        <SearchIcon color="white" width={16} />
      </Link>
    </div>
  );
};

export default SearchInput;
