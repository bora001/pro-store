"use server";
import { ProductItemType } from "@/types";
import client from "../typesense";
import { SearchResponse } from "typesense/lib/Typesense/Documents";
import { initProductSearch } from "./product/init-product-search";

export async function autoComplete(queryText: string) {
  try {
    await initProductSearch();
    const params = { q: queryText, query_by: "name", prefix: true, filter_by: "stock:>0" };
    const searchResults = (await client
      .collections("products")
      .documents()
      .search(params)) as SearchResponse<ProductItemType>;

    return searchResults.hits?.map((hit) => hit.document.name);
  } catch (error) {
    return [];
  }
}
