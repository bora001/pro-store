import client from "../typesense";
import { ProductIndexType } from "./createProductIndex";

export async function createOneProductIndex(product: ProductIndexType) {
  try {
    const created = await client
      .collections("products")
      .documents()
      .create({
        ...product,
        createdAt: product.createdAt,
        rating: parseFloat(product.rating.toString()),
      });
    console.log("Typesense updated:", created);
  } catch (error) {
    console.error("Typesense updated fail:", error);
  }
}
