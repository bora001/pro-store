import { TYPESENSE_KEY } from "@/lib/constants";
import { deleteCollections } from "../delete-collections";
import client from "@/lib/typesense";
import { importProductsByTagToTypesense } from "./import-product-by-tag-index";
import { initializeModel } from "../initialize-model";
import { productByTagSchema } from "../model/schema";

export async function initProductByTagSearch() {
  try {
    const collections = await client
      .collections(TYPESENSE_KEY.PRODUCT_BY_TAG)
      .exists();
    if (!collections) {
      await initializeModel(productByTagSchema);
      await importProductsByTagToTypesense();
      console.log("Products collection created");
    }
    return true;
  } catch (e) {
    console.error("Typesense initialization error", e);
    await deleteCollections(TYPESENSE_KEY.PRODUCT_BY_TAG);
    await initializeModel(productByTagSchema);
    await importProductsByTagToTypesense();
    return true;
  }
}
