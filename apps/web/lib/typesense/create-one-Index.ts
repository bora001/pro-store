import client from "../typesense";

export async function createOneIndex<T extends object[]>(key: string, data: T) {
  try {
    const created = await client.collections(key).documents().import(data, { action: "upsert" });
    console.log("Typesense created:", created);
  } catch (error) {
    console.error("Typesense created fail:", error);
  }
}
