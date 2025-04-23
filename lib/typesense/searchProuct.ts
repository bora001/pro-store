import client from "../typesense";

export async function searchProducts() {
  try {
    const searchResults = await client
      .collections("products")
      .documents()
      .search({
        q: "product_name",
        query_by: "name",
      });

    console.log("Search Results:", searchResults);
  } catch (error) {
    console.error("Error during search:", error);
  }
}
