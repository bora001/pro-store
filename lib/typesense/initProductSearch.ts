import client from "../typesense";
import { createProductIndex } from "./createProductIndex";
import { deleteCollections } from "./deleteCollections";
import { importProductsToTypesense } from "./insertProductIndex";

export async function initProductSearch() {
  try {
    const collections = await client.collections("products").exists();
    if (!collections) {
      createProductIndex();
      importProductsToTypesense();
      console.log("Products collection created");
    } else {
      importProductsToTypesense();
      console.log("Products collection already exists");
    }
  } catch (e) {
    console.error("Typesense initialization error", e);
    deleteCollections("products");
  }
}
