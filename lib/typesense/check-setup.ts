import { TYPESENSE_KEY } from "../constants";
import { initProductByTagSearch } from "./product-by-tag/init-product-by-tag-search";
import { initProductSearch } from "./product/init-product-search";

const INITIAL_SETUP = {
  [TYPESENSE_KEY.PRODUCT_BY_TAG]: initProductByTagSearch,
  [TYPESENSE_KEY.PRODUCT]: initProductSearch,
};

export async function checkSetupTypesense(key: string) {
  try {
    const setupFn = INITIAL_SETUP[key];
    if (setupFn) {
      const success = await setupFn();
      return success;
    } else {
      console.warn(`No setup function found for key: ${key}`);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}
