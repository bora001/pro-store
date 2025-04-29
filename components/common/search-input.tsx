"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { URLChanger, cn } from "@/lib/utils";
import { autocomplete } from "@/lib/typesense/autoComplete";
import { debounce } from "lodash";

const SearchInput = ({
  path,
  autoComplete,
}: {
  path?: string;
  autoComplete?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchKeyword, setSearchKeyword] = useState(query);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const pathname = usePathname();
  const generateURL = useCallback(
    (value: string) =>
      URLChanger({
        params: searchParams.toString(),
        pathname: path || pathname,
        key: "query",
        value,
      }),
    [searchParams, path, pathname]
  );

  const hasRecommendations =
    recommendations.length > 0 &&
    searchKeyword.length > 0 &&
    recommendations[0] !== searchKeyword &&
    query !== searchKeyword;

  useEffect(() => {
    setSearchKeyword(query);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.replace(generateURL(searchKeyword));
    }
  };
  const debouncedAutocomplete = useMemo(() => {
    return debounce((value: string) => {
      autocomplete(value)
        .then((results) => {
          setRecommendations(results as string[]);
        })
        .catch((error) => console.error("Autocomplete failed:", error));
    }, 300);
  }, [setRecommendations]);

  useEffect(() => {
    if (searchKeyword && autoComplete) {
      debouncedAutocomplete(searchKeyword);
    }
  }, [autoComplete, debouncedAutocomplete, searchKeyword]);

  const getRecommendation = (value: string) => {
    router.replace(generateURL(value));
    setSearchKeyword("");
    setRecommendations([]);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setRecommendations([]);
    }, 1000);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 w-80">
        <Input
          className="border-t-0 border-r-0 border-l-0 border-b-1 rounded-none"
          value={searchKeyword}
          placeholder="Search"
          onKeyDown={handleKeyDown}
          onChange={handleInput}
          onBlur={handleBlur}
        />

        <Link
          href={generateURL(searchKeyword)}
          className="bg-black px-3 flex items-center justify-center rounded-sm"
          aria-label="search"
        >
          <SearchIcon color="white" width={16} />
        </Link>
      </div>

      <div
        className={cn(
          "w-80 text-sm absolute bg-white px-4 py-3 mt-3 rounded-sm shadow-lg max-h-52 overflow-y-scroll dark:bg-black",
          hasRecommendations ? "block" : "hidden"
        )}
      >
        {recommendations.map((item, idx) => (
          <div
            className="py-2 cursor-pointer hover:font-semibold"
            key={idx}
            onClick={() => getRecommendation(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;
