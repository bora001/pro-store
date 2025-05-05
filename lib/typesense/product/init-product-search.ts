import client from "../../typesense";
import { deleteCollections } from "../delete-collections";
import { initializeModel } from "../initialize-model";
import { productSchema } from "../model/schema";
import { TYPESENSE_KEY } from "@/lib/constants";
import { insertProductsToTypesense } from "./insert-product-index";

export async function initProductSearch() {
  try {
    const collections = await client
      .collections(TYPESENSE_KEY.PRODUCT)
      .exists();
    if (!collections) {
      await initializeModel(productSchema);
      await insertProductsToTypesense();
      console.log("Products collection created");
    }
    return true;
  } catch (e) {
    console.error("Typesense initialization error", e);
    await deleteCollections("products");
    await initializeModel(productSchema);
    await insertProductsToTypesense();
    return true;
  }
}
