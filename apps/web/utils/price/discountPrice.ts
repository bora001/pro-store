import Decimal from "decimal.js";

// discount-price
export const discountPrice = (
  price: number, // original price
  discount?: number,
  condition?: boolean // discount condition
): number => {
  if (!condition || !discount) return price;
  const priceDecimal = new Decimal(price);
  const discountDecimal = new Decimal(100).minus(discount).div(100);
  const discounted = priceDecimal.mul(discountDecimal);
  return +discounted.toDecimalPlaces(2);
};
