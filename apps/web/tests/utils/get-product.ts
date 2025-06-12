import { PATH } from "@/lib/constants";
import { getRandomValue } from "@/utils/get-random-value";
import { Page } from "@playwright/test";

export async function getProduct(page: Page) {
  await page.goto(PATH.HOME);
  const productList = await page.$$eval('a[href^="/product/"]', (links) =>
    links.map((link) => link.getAttribute("href") || "")
  );
  const product = getRandomValue(productList);
  await page.goto(product);
  const productTitle = page.locator("h1");
  return await productTitle.textContent();
}
