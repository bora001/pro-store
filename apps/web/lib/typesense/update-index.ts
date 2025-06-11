import client from "../typesense";

export async function updateIndex<T extends object>(model: string, data: T, id: string) {
  try {
    const updated = await client
      .collections(model)
      .documents(id)
      .update({ ...data });
    console.log("Typesense updated:", updated);
  } catch (error) {
    console.error("Typesense updated fail:", error);
  }
}
