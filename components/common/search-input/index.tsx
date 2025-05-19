"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../../ui/input";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { URLChanger } from "@/lib/utils";
import { autoComplete } from "@/lib/typesense/auto-complete";
import { debounce } from "lodash";
import RecommendationList from "./recommendations-list";

const SearchInput = ({ path, autoCompleteRequired }: { path?: string; autoCompleteRequired?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("query") || "";
  const [searchKeyword, setSearchKeyword] = useState(query);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  const generateURL = useCallback(
    (value: string) => URLChanger({ params: searchParams.toString(), pathname: path || pathname, key: "query", value }),
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
    const n = recommendations.length;
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = activeIndex === null ? searchKeyword : recommendations[activeIndex];
      if (!keyword.trim()) return;
      router.replace(generateURL(keyword));
    } else if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % n));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev === null ? n - 1 : (prev - 1 + n) % n));
    }
  };

  useEffect(() => {
    const debouncedAutocomplete = debounce((value: string) => {
      autoComplete(value)
        .then((results) => setRecommendations(results as string[]))
        .catch(console.error);
    }, 300);

    if (searchKeyword && autoCompleteRequired) {
      debouncedAutocomplete(searchKeyword);
    }

    return () => debouncedAutocomplete.cancel();
  }, [searchKeyword, autoCompleteRequired]);

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

  useEffect(() => {
    setActiveIndex(null);
  }, [searchKeyword]);

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
          autoComplete="off"
        />
        <Link
          href={generateURL(searchKeyword)}
          className="bg-black px-3 flex items-center justify-center rounded-sm"
          aria-label="search"
        >
          <SearchIcon color="white" width={16} />
        </Link>
      </div>
      {hasRecommendations && (
        <RecommendationList
          activeIndex={activeIndex}
          recommendations={recommendations}
          getRecommendation={getRecommendation}
          setActiveIndex={setActiveIndex}
        />
      )}
    </div>
  );
};

export default SearchInput;
