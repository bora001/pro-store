//
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export type DeleteImageResponseType<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};
export const deleteImage = async (
  keys: string[],
  folder: string
): Promise<DeleteImageResponseType[]> => {
  if (!keys.length || !folder) {
    throw new Error("Missing required fields: keys or folder");
  }
  try {
    const deletePromises = keys.map((key) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `${folder}/${key}`,
      };
      return s3.send(new DeleteObjectCommand(params));
    });

    await Promise.all(deletePromises);
    return keys.map((key) => ({
      success: true,
      message: `File ${key} deleted successfully`,
      key,
    }));
  } catch (error) {
    console.error("Error deleting files from S3:", error);
    throw new Error("File deletion failed");
  }
};
export const uploadImage = async (
  file: string,
  folder: string,
  fileName: string,
  fileType: string
) => {
  const buffer = Buffer.from(file, "base64");
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `${folder}/${fileName}`,
    Body: buffer,
    ContentType: fileType,
  };

  await s3.send(new PutObjectCommand(params));
};
