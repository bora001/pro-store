import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  IMAGE_URL: process.env.NEXT_PUBLIC_AWS_S3_URL || "/",
  WS_HOST: process.env.NEXT_PUBLIC_WS_HOST || "localhost",
  WS_PORT: process.env.NEXT_PUBLIC_WS_PORT ? parseInt(process.env.NEXT_PUBLIC_WS_PORT, 10) : 3001,
};
