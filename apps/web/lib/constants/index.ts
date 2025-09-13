import { PaymentKeyType } from "@/types";

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

export const MANUAL_QUESTIONS = {
  delivery: {
    question: "🕰️ Delivery time",
    answer:
      "Generally, shipping will be completed within 14 days after placing an order. However, delivery times may vary depending on the region and logistics situation.",
  },
  payment: {
    question: "💰 Payment methods",
    answer: "We offer PayPal and Stripe as payment methods.",
  },
  issue: {
    question: "⚠️ Product issue",
    answer:
      "If there is a defect in the product, you can request an exchange or refund within 7 days of receiving the item. Please contact our customer service for detailed guidance.",
  },
  shipping: {
    question: "📦 Shipping fee",
    answer: "We offer free shipping for orders over $100.",
  },
} as const;

export const SYSTEM_TYPE = {
  SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};

export const PAYMENT_METHODS = {
  PayPal: { key: "PayPal", label: "PayPal" },
  Stripe: { key: "Stripe", label: "Stripe" },
  CashOnDelivery: { key: "CashOnDelivery", label: "Cash On Delivery" },
} as const;
export const PAYMENT_METHODS_KEYS = Object.values(PAYMENT_METHODS).map(({ key }) => key);
export const PAYMENT_METHODS_LIST = PAYMENT_METHODS_KEYS as [PaymentKeyType, ...PaymentKeyType[]];

export const USER_ROLE = ["admin", "user"];
export const CHAT_ROLE = {
  USER: "user",
  ASSISTANT: "assistant",
  DEFAULT: "default",
  RECOMMENDATIONS: "recommendations",
} as const;

export const REDIS_KEY = {
  BANNER: "cache:banner",
  ACTIVE_DEAL: "cache:deal:active",
  ADMIN_PRODUCT_LIST: "cache:admin:product:list",
  ADMIN_DEAL_LIST: "cache:admin:deal:list",
  SETTING: "cache:setting",
};

export const TYPESENSE_KEY = {
  PRODUCT: "products",
  PRODUCT_BY_TAG: "product-by-tag",
};

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
  SETTING: "/admin/setting",

  API_GET_PRESIGNED_URL: "/api/get-presigned-url",
  API_UPLOAD_IMAGE: "/api/image/upload",
  API_DELETE_IMAGE: "/api/image/delete",
};
