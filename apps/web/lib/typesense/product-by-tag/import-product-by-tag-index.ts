import { prisma } from "@/db/prisma";
import client from "../../typesense";
import { TYPESENSE_KEY } from "@/lib/constants";
import { ProductByTagSchemaIndexConvertor } from "../model/index-schema-convertor";

export async function importProductsByTagToTypesense() {
  try {
    const product = await prisma.product.findMany({ include: { tags: true } });
    const productByTagData = ProductByTagSchemaIndexConvertor(product);
    await client.collections(TYPESENSE_KEY.PRODUCT_BY_TAG).documents().import(productByTagData, { action: "create" });
    console.log("products by tag imported successfully");
  } catch (error: unknown) {
    console.error("Error importing products:", error);
    if (error && typeof error === "object" && "importResults" in error) {
      console.error("Failed import results");
    }
  }
}
