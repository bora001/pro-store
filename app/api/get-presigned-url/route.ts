import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const folder = searchParams.get("folder");

    if (!fileName || !folder) {
      return new Response(
        JSON.stringify({ error: "Missing fileName or folder" }),
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `${folder}/${fileName}`,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    console.error("Failed to generate presigned URL :", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate presigned URL" }),
      {
        status: 500,
      }
    );
  }
}
