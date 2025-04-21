"use server";
import { ProductItemType } from "@/types";
import client from "../typesense";
import { SearchResponse } from "typesense/lib/Typesense/Documents";
import { initProductSearch } from "./initProductSearch";

export async function autocomplete(queryText: string) {
  try {
    const searchResults = (await client
      .collections("products")
      .documents()
      .search({
        q: queryText,
        query_by: "name",
        prefix: true,
        filter_by: "stock:>0",
      })) as SearchResponse<ProductItemType>;

    return searchResults.hits?.map((hit) => hit.document.name);
  } catch (error) {
    initProductSearch();
    console.error("Error during autocomplete search:", error);
    throw error;
  }
}
