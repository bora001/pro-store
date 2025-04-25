export const CONSTANTS = {
  LATEST_PRODUCT_LIMIT: 4,
  PAGE_LIMIT: 5,
  ADMIN: "admin",
  ALL: "all",
  INIT_REVIEW_RATING: 0,
  AVG_REVIEW_RATING: 3,
  COMPLETED: "COMPLETED",
  FREE_SHIPPING_THRESHOLD: 100,
  SHIPPING_FEE: 10,
  TAX_RATE: 0.15,
  HEADER_HEIGHT: 80,
};
export const SYSTEM_TYPE = {
  SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};

export const PAYMENT_METHODS = ["PayPal", "Stripe", "CashOnDelivery"] as const;
export const USER_ROLE = ["admin", "user"];
export const PATH = {
  HOME: "/",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  PRODUCT: "/product",
  CART: "/cart",
  SEARCH: "/search",

  ORDER: "/order",
  SHIPPING: "/shipping-address",
  PAYMENT: "/payment-method",
  MY_ORDER: "/user/order",
  MY_PROFILE: "/user/profile",

  DASHBOARD: "/admin/dashboard",
  PRODUCTS: "/admin/products",
  CREATE_PRODUCTS: "/admin/products/create",
  CREATE_DEALS: "/admin/deals/create",
  USERS: "/admin/users",
  ORDERS: "/admin/orders",
  DEALS: "/admin/deals",

  API_GET_PRESIGNED_URL: "/api/get-presigned-url",
  API_UPLOAD_IMAGE: "/api/image/upload",
  API_DELETE_IMAGE: "/api/image/delete",
};
