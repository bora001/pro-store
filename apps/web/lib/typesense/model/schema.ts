import { TYPESENSE_KEY } from "@/lib/constants";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const productSchema: CollectionCreateSchema = {
  name: TYPESENSE_KEY.PRODUCT,
  fields: [
    { name: "id", type: "string", optional: false },
    { name: "name", type: "string", optional: false, facet: true },
    { name: "category", type: "string", optional: false },
    { name: "description", type: "string", optional: false },
    { name: "brand", type: "string", optional: false },
    { name: "stock", type: "int32", optional: false },
  ],
  default_sorting_field: "stock",
} as const;

export const productByTagSchema: CollectionCreateSchema = {
  name: TYPESENSE_KEY.PRODUCT_BY_TAG,
  fields: [
    { name: "id", type: "string", optional: false },
    { name: "name", type: "string", optional: false, facet: true },
    { name: "description", type: "string", optional: false },
    { name: "brand", type: "string", optional: false },
    { name: "stock", type: "int32", optional: false },
    { name: "tags", type: "string", optional: true },
    { name: "slug", type: "string", optional: false },
    { name: "images", type: "string", optional: false },
  ],
  default_sorting_field: "stock",
} as const;
