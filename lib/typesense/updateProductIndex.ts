import client from "../typesense";
import { ProductIndexType } from "./createProductIndex";

export async function updateProductIndex(product: ProductIndexType) {
  try {
    const updated = await client
      .collections("products")
      .documents(product.id)
      .update({
        ...product,
      });
    console.log("Typesense updated:", updated);
  } catch (error) {
    console.error("Typesense updated fail:", error);
  }
}
