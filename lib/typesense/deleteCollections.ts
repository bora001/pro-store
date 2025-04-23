import client from "../typesense";

export async function deleteCollections(model: string) {
  try {
    const response = await client.collections(model).delete();
    console.log("Typesense index deleted:", response);
  } catch (error) {
    console.error("Error deleting index:", error);
  }
}
