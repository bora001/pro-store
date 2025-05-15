import { deleteImage } from "@/lib/actions/utils/images.utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keys, folder } = body;
    if (!keys || !folder) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const results = await deleteImage(keys, folder);
    return new Response(JSON.stringify({ results }), { status: 200 });
  } catch (error) {
    console.error("Error handling image delete request:", error);
    return new Response(JSON.stringify({ error: "File upload failed" }), {
      status: 500,
    });
  }
}
