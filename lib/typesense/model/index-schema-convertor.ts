import { updateProductType } from "@/types";
import { ProductByTagIndexType, ProductIndexType } from "./type";

export const ProductSchemaIndexConvertor = (product: updateProductType[]): ProductIndexType[] => {
  return product.map(({ id = "", name, category, description, brand, stock }) => ({
    id,
    name,
    category,
    description,
    brand,
    stock,
  }));
};
export const ProductByTagSchemaIndexConvertor = (product: updateProductType[]): ProductByTagIndexType[] => {
  return product.map(({ id = "", name, description, brand, stock, slug, tags, images }) => ({
    id,
    name,
    description,
    brand,
    stock,
    tags: tags?.map((tag) => tag.name).join(" ") || "",
    slug,
    images: images[0],
  }));
};
