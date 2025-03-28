export const CONSTANTS = {
  LATEST_PRODUCT_LIMIT: 4,
};

export const PAYMENT_METHODS = ["PayPal", "Stripe", "CashOnDelivery"] as const;

export const PATH = {
  SHIPPING: "/shipping-address",
  PAYMENT: "/payment-method",
  CART: "/cart",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  HOME: "/",
};
