import { ProductItemType } from "@/types";

export type ProductIndexType = Pick<ProductItemType, "id" | "name" | "category" | "description" | "brand" | "stock">;

export type ProductByTagIndexType = Pick<
  ProductItemType,
  "id" | "name" | "description" | "brand" | "stock" | "slug"
> & { images: string; tags: string };
