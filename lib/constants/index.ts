export const CONSTANTS = {
  LATEST_PRODUCT_LIMIT: 4,
  PAGE_LIMIT: 5,
  ADMIN: "admin",
  ALL: "all",
  INIT_REVIEW_RATING: 0,
  AVG_REVIEW_RATING: 3,
};

export const PAYMENT_METHODS = ["PayPal", "Stripe", "CashOnDelivery"] as const;
export const USER_ROLE = ["admin", "user"];
export const PATH = {
  SHIPPING: "/shipping-address",
  PAYMENT: "/payment-method",
  CART: "/cart",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  MY_ORDER: "/user/order",
  MY_PROFILE: "/user/profile",
  PRODUCT: "/product",
  ORDER: "/order",
  HOME: "/",
  DASHBOARD: "/admin/dashboard",
  PRODUCTS: "/admin/products",
  CREATE_PRODUCTS: "/admin/products/create",
  USERS: "/admin/users",
  ORDERS: "/admin/orders",
  SEARCH: "/search",
};
