import { updateProductType } from "@/types";
import { ProductByTagIndexType, ProductIndexType } from "./type";

export const ProductSchemaIndexConvertor = (
  product: updateProductType[]
): ProductIndexType[] => {
  return product.map((product) => ({
    id: product.id || "",
    name: product.name,
    category: product.category,
    description: product.description,
    brand: product.brand,
    stock: product.stock,
  }));
};
export const ProductByTagSchemaIndexConvertor = (
  product: updateProductType[]
): ProductByTagIndexType[] => {
  return product.map((product) => ({
    id: product.id || "",
    name: product.name,
    description: product.description,
    brand: product.brand,
    stock: product.stock,
    tags: product.tags?.map((tag) => tag.name).join(" ") || "",
    slug: product.slug,
    images: product.images[0],
  }));
};
