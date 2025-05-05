import client from "../typesense";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export async function initializeModel<T extends CollectionCreateSchema>(
  model: T
) {
  try {
    const index = await client.collections().create(model);
    console.log("Typesense index created:", index);
  } catch (error) {
    console.error("Error creating index:", error);
  }
}
