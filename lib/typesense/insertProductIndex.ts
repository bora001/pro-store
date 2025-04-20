import { prisma } from "@/db/prisma";
import client from "../typesense";
import { ImportError } from "typesense/lib/Typesense/Errors";

export async function importProductsToTypesense() {
  try {
    const books = await prisma.product.findMany();
    const productData = books.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      brand: product.brand,
      price: parseFloat(product.price.toString()),
      rating: parseFloat(product.rating.toString()),
      numReviews: product.numReviews,
      stock: product.stock,
      createdAt: product.createdAt.getTime(),
    }));

    const result = await client
      .collections("products")
      .documents()
      .import(productData, {
        action: "create",
      });

    console.log("products imported successfully", result);
  } catch (error: ImportError | unknown) {
    console.error("Error importing products:", error);
    if (error && typeof error === "object" && "importResults" in error) {
      console.error("Failed import results:", error.importResults);
    }
  }
}
