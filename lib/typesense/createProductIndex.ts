import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import client from "../typesense";
import { ProductItemType } from "@/types";
export interface ProductIndexType
  extends Pick<
    ProductItemType,
    | "id"
    | "name"
    | "category"
    | "description"
    | "brand"
    | "numReviews"
    | "stock"
  > {
  createdAt: number;
  rating: number;
}
const productSchema: CollectionCreateSchema = {
  name: "products",
  fields: [
    { name: "id", type: "string", optional: false },
    { name: "name", type: "string", optional: false, facet: true },
    { name: "category", type: "string", optional: false },
    { name: "description", type: "string", optional: false },
    { name: "brand", type: "string", optional: false },
    { name: "rating", type: "float", optional: false },
    { name: "numReviews", type: "int32", optional: false },
    { name: "stock", type: "int32", optional: false },
    { name: "createdAt", type: "int64", optional: false },
  ],
  default_sorting_field: "createdAt",
} as const;

export async function createProductIndex() {
  try {
    const index = await client.collections().create(productSchema);
    console.log("Typesense index created:", index);
  } catch (error) {
    console.error("Error creating index:", error);
  }
}
