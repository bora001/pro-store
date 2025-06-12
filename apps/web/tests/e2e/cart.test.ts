import { PATH } from "@/lib/constants";
import { test, expect, Page } from "@playwright/test";
import { getProduct } from "../utils/get-product";

async function stockCheck(page: Page) {
  const statusText = await page
    .locator('[data-testid="product-status"]')
    .textContent();
  if (statusText !== "In Stock") {
    console.log("Product is not in stock, cannot add to cart.");
    return false;
  }
}

async function addItemToCart(page: Page) {
  const titleText = await getProduct(page);
  const hasStock = await stockCheck(page);
  if (!hasStock) return false;
  const addToCartButton = page.locator('button:has-text("Add to Cart")');
  await addToCartButton.click();
  await expect(addToCartButton).toBeEnabled();
  await page.goto(PATH.CART);
  await page.waitForURL(PATH.CART);
  const cartItem = page.locator('[data-testid="product-name"]', {
    hasText: titleText || "",
  });
  await expect(cartItem).toBeVisible();
}
test.describe("Add product to cart", () => {
  test("Add product to cart and verify it in the cart when status is 'In Stock'", async ({
    page,
  }) => {
    const addedCart = await addItemToCart(page);
    if (!addedCart) return;
  });
  test("Increase quantity and verify price change", async ({ page }) => {
    const addedCart = await addItemToCart(page);
    if (!addedCart) return;

    const productQty = await page
      .locator('[data-testid="product-qty"]')
      .textContent();
    const productPrice =
      (await page.locator('[data-testid="Items-price"]').textContent()) || "";
    const increaseQuantityButton = page.locator(
      '[data-testid="handle-qty-plus"]'
    );
    await increaseQuantityButton.click();
    await expect(increaseQuantityButton).toBeEnabled();
    const newQty = await page
      .locator('[data-testid="product-qty"]')
      .textContent();
    const newPrice = await page
      .locator('[data-testid="Items-price"]')
      .textContent();
    expect(newQty).toBe(String(+(productQty || 0) + 1));
    expect(newPrice).toBe(
      `$${(+(parseFloat(productPrice.replace("$", "")).toFixed(2) || 0) * 2).toFixed(2)}`
    );
  });
  test("Decrease quantity and verify cart is empty", async ({ page }) => {
    const addedCart = await addItemToCart(page);
    if (!addedCart) return;

    const decreaseQuantityButton = page.locator(
      '[data-testid="handle-qty-minus"]'
    );
    await decreaseQuantityButton.click();
    await expect(decreaseQuantityButton).toBeHidden();
    const emptyTitle = await page
      .locator('[data-testid="empty-title"]')
      .textContent();
    expect(emptyTitle).toBe("Cart is empty...");
  });
});
