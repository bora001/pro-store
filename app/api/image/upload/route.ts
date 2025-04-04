import { uploadImage } from "@/lib/actions/image.actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file, fileName, fileType, folder } = body;

    if (!file || !fileName || !fileType || !folder) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }
    await uploadImage(file, folder, fileName, fileType);
    return new Response(
      JSON.stringify({ message: "File uploaded successfully", fileName }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return new Response(JSON.stringify({ error: "File upload failed" }), {
      status: 500,
    });
  }
}
