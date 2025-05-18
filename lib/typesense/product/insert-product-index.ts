import { prisma } from "@/db/prisma";
import client from "../../typesense";
import { TYPESENSE_KEY } from "@/lib/constants";
import { ProductSchemaIndexConvertor } from "../model/index-schema-convertor";

export async function insertProductsToTypesense() {
  try {
    const product = await prisma.product.findMany();
    const productData = ProductSchemaIndexConvertor(product);
    await client.collections(TYPESENSE_KEY.PRODUCT).documents().import(productData, { action: "create" });
    console.log("products imported successfully");
  } catch (error: unknown) {
    console.error("Error importing products:", error);
    if (error && typeof error === "object" && "importResults" in error) {
      console.error("Failed import results");
    }
  }
}
