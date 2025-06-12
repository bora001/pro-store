import { PATH } from "@/lib/constants";
import { getRandomValue } from "@/utils/get-random-value";
import { Page, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export async function login(
  page: Page,
  credential: { email: string; password: string }
) {
  await page.goto(PATH.SIGN_IN);
  await page.getByPlaceholder("email@example.com").fill(credential.email);
  await page.getByPlaceholder("password").fill(credential.password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(PATH.HOME);
}

export async function testRedirectToSignIn(page: Page, paths: string[]) {
  const randomPath = getRandomValue(paths);
  expect(paths).toContain(randomPath);
  await page.goto(randomPath);
  const currentUrl = new URL(page.url());
  expect(currentUrl.pathname).toBe(PATH.SIGN_IN);
  expect(currentUrl.searchParams.has("callbackUrl")).toBe(true);
  expect(currentUrl.searchParams.get("callbackUrl")).toBe(
    `${currentUrl.origin}${randomPath}`
  );
}
