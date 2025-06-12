import { TYPESENSE_KEY } from "@/lib/constants";
import client from "../../typesense";
import { SearchResponse } from "typesense/lib/Typesense/Documents";
import { ProductByTagIndexType } from "../model/type";
import { initProductByTagSearch } from "./init-product-by-tag-search";

export type TypesenseProductByTag = { slug: string; images: string; name: string };
export async function searchProductByTag(query: string[]) {
  try {
    await initProductByTagSearch();
    const keywordFilters = query[0]
      .split(" ")
      .map((word) => {
        const escaped = word.includes(" ") ? `"${word}"` : word;
        return `(name:~${escaped} || tags:=[${escaped}] || description:~${escaped})`;
      })
      .join(" || ");

    const params = {
      q: query.join(" "),
      query_by: ["description", "tags", "brand", "name"].join(","),
      filter_by: query[0] === "general" ? "stock:>0" : `stock:>0 && (${keywordFilters})`,
      limit: 8,
      num_typos: 1,
    };
    const searchResults = (await client
      .collections(TYPESENSE_KEY.PRODUCT_BY_TAG)
      .documents()
      .search(params)) as SearchResponse<ProductByTagIndexType>;

    return searchResults.hits?.map(({ document: { slug, images, name } }) => ({ slug, images, name })) || [];
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}
