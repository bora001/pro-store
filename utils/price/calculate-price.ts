import { CONSTANTS } from "@/lib/constants";
import { CartItemType, addDealType } from "@/types";
import Decimal from "decimal.js";

/**
 * Calculates final price of items with optional deal applied.
 * 💡 This function does NOT check if the deal is valid.
 *    If the third parameter (`isActiveDeal`) is not provided, the deal is treated as valid.
 *
 * 👇 Example 1:
 *
 * const activeDeal = await hasIncludedDeal({ // 👈 checks active deal from real-time database in the server action
 *   items: cart.data.items,
 *   dealOptions: { endTime: { gte: new Date() } },
 * });
 * const cartPrice = calculatePrice(cart.data.items, activeDeal.data); // 👈 third parameter is not provided, the deal is treated as valid
 *
 * 👇 Example 2:
 *
 * const cartPrice = calculatePrice(cart?.items || [], deal, isActiveDeal);
 *
 * 👉 If you want to disable deal logic manually:
 * const cartPrice = calculatePrice(cart.data.items, activeDeal.data, false);
 */

export function calculatePrice(
  item: CartItemType[],
  deal?: addDealType,
  isActiveDeal: boolean = true
) {
  const itemPrice = item.reduce((acc, item) => {
    const price = new Decimal(item.price);
    const discountedPrice =
      deal?.productId === item.productId && isActiveDeal // isDealItem
        ? price
            .mul(new Decimal(100).minus(deal.discount).div(100)) // ig. 10% discount : 39.95 * 0.9 = 35.955
            .toDecimalPlaces(2) // Round to two decimal places (ig.35.955 -> 35.96)
        : price;
    return acc.plus(discountedPrice.mul(item.qty));
  }, new Decimal(0));

  const shippingPrice = itemPrice.gte(CONSTANTS.FREE_SHIPPING_THRESHOLD)
    ? new Decimal(0)
    : new Decimal(CONSTANTS.SHIPPING_FEE); // free shipping when item price over $100
  const taxPrice = itemPrice.mul(CONSTANTS.TAX_RATE); // tax - 15%
  const totalPrice = itemPrice.plus(shippingPrice).plus(taxPrice);
  const format = (value: Decimal) => value.toDecimalPlaces(2).toFixed(2);

  return {
    itemPrice: format(itemPrice),
    shippingPrice: format(shippingPrice),
    taxPrice: format(taxPrice),
    totalPrice: format(totalPrice),
  };
}
