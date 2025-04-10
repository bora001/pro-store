import { Page } from "@playwright/test";

export const getAllText = async (page: Page, type: string) => {
  const items = await page.locator(type).all();
  return await Promise.all(items.map((item) => item.textContent()));
};
