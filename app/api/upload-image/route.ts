import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

    const buffer = Buffer.from(file, "base64");
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `${folder}/${fileName}`,
      Body: buffer,
      ContentType: fileType,
    };

    await s3.send(new PutObjectCommand(params));
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
