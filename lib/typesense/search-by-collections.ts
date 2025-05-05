import client from "../typesense";

export async function searchProductByTag(key: string) {
  try {
    const searchResults = await client.collections(key).documents().search({
      q: "*",
      filter_by: "stock:>0",
    });

    return searchResults.hits;
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}
