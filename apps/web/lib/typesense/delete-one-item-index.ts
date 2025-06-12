import client from "../typesense";

export async function deleteOneItemIndex({ model, id }: { model: string; id: string }) {
  try {
    const response = await client
      .collections(model)
      .documents()
      .delete({ filter_by: `id:=${id}` });
    console.log("Typesense index deleted:", response);
  } catch (error) {
    console.error("Error deleting index:", error);
  }
}
