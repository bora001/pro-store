"use client";
import { URLChanger, capitalize } from "@/lib/utils";
import { CategoryType } from "@/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const PRICE_FILTER = [
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $100", value: "51-100" },
  { name: "$101 to $150", value: "101-150" },
  { name: "$151 to $200", value: "151-200" },
];

const RATING_FILTER = ["4", "3", "2", "1"];

const MainFilter = ({ category }: { category: CategoryType[] }) => {
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

  const FilterItem = ({
    type,
    itemList,
  }: {
    type: string;
    itemList: ReactNode;
  }) => {
    return (
      <>
        <h3 className="text-xl mb-2 mt-3">{capitalize(type)}</h3>
        <div>
          <ul className="space-y-1">
            <Link
              className={params.get(type) === null ? "font-bold" : ""}
              href={changeURL(type, "")}
            >
              All
            </Link>
            {itemList}
          </ul>
        </div>
      </>
    );
  };

  return (
    <>
      {/* category */}
      <FilterItem
        type="category"
        itemList={
          <>
            {category.map(({ category }) => (
              <Link
                key={category}
                href={changeURL("category", category)}
                className={
                  params.get("category") === category ? "font-bold" : ""
                }
              >
                <p>{category}</p>
              </Link>
            ))}
          </>
        }
      />
      {/* price */}
      <FilterItem
        type="price"
        itemList={
          <>
            {PRICE_FILTER.map(({ name, value }) => (
              <Link
                key={name}
                href={changeURL("price", value)}
                className={params.get("price") === value ? "font-bold" : ""}
              >
                <p>{name}</p>
              </Link>
            ))}
          </>
        }
      />
      <FilterItem
        type="rating"
        itemList={
          <>
            {RATING_FILTER.map((rating) => (
              <Link
                key={rating}
                href={changeURL("rating", rating)}
                className={params.get("rating") === rating ? "font-bold" : ""}
              >
                <p>{rating} stars & up</p>
              </Link>
            ))}
          </>
        }
      />
    </>
  );
};

export default MainFilter;
