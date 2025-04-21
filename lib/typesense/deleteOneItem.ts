import client from "../typesense";

export async function deleteItemIndex({
  model,
  id,
}: {
  model: string;
  id: string;
}) {
  try {
    const response = await client.collections(model).documents(id).delete();
    console.log("Typesense index deleted:", response);
  } catch (error) {
    console.error("Error deleting index:", error);
  }
}
