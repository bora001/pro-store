import path from "path";
import dotenv from "dotenv";
const envPath = path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: envPath });

export const COMMON_CONFIG = {
  WS_HOST: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_WS_HOST : "0.0.0.0",
};
