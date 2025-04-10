import { test, expect } from "@playwright/test";
import { login, testRedirectToSignIn } from "../utils/login";
import { PATH } from "@/lib/constants";
import { getRandomValue } from "@/utils/get-random-value";

const adminPaths = [
  PATH.DASHBOARD,
  PATH.PRODUCTS,
  PATH.CREATE_PRODUCTS,
  PATH.CREATE_DEALS,
  PATH.USERS,
  PATH.ORDERS,
  PATH.DEALS,
];
const requireLoginPaths = [
  PATH.MY_ORDER,
  PATH.MY_PROFILE,
  PATH.SHIPPING,
  PATH.PAYMENT,
];
const normalPaths = [
  PATH.SIGN_UP,
  PATH.SIGN_IN,
  PATH.PRODUCT,
  PATH.CART,
  PATH.SEARCH,
];

test.describe("Admin page access before login", () => {
  test("enters normal page", async ({ page }) => {
    const randomPath = getRandomValue(normalPaths);
    await page.goto(randomPath);
    await expect(page).toHaveURL(randomPath);
  });
  test("enters admin page", async ({ page }) => {
    await testRedirectToSignIn(page, adminPaths);
  });
  test("enters login required page", async ({ page }) => {
    await testRedirectToSignIn(page, requireLoginPaths);
  });
});

test.describe("Admin page access after login", () => {
  test("Admin account - successfully enters admin page", async ({ page }) => {
    await login(page, {
      email: process.env.TEST_ADMIN_EMAIL!,
      password: process.env.TEST_PASSWORD!,
    });
    const randomPath = getRandomValue(adminPaths);
    await page.goto(randomPath);
    await expect(page).toHaveURL(randomPath);
  });

  test("Regular user account - fails to access admin and redirects to home", async ({
    page,
  }) => {
    await login(page, {
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_PASSWORD!,
    });
    const randomPath = getRandomValue(adminPaths);
    await page.goto(randomPath);
    await expect(page).toHaveURL(PATH.HOME);
  });
});
