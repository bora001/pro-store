import { defineConfig } from "@playwright/test";
import { CONFIG } from "./lib/constants/config";
import "dotenv/config";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: CONFIG.APP_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
  },
});
