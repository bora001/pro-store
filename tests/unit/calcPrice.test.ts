import type { CartItemType, addDealType } from "@/types";
import { calculatePrice } from "@/utils/price/calculate-price";

const dummyProductObject = {
  productId: "product-id",
  name: "product-name",
  slug: "product-slug",
  image: "product-image",
};
const dummyDealObject = {
  id: "product-id",
  type: "deal-type",
  title: "deal-title",
  description: "deal-description",
  endTime: new Date(),
  productId: "product-id",
  isActive: true,
};

describe("calculatePrice", () => {
  // assumes that only valid deals (with endTime >= now) are passed
  it("calculates price without discount", async () => {
    const item: CartItemType[] = [
      {
        ...dummyProductObject,
        price: "50",
        qty: 2,
      },
    ];
    const result = calculatePrice(item);
    expect(result).toEqual({
      itemPrice: "100.00",
      shippingPrice: "0.00",
      taxPrice: "15.00",
      totalPrice: "115.00",
    });
  });
  it("calculates price with discount deal", async () => {
    const item: CartItemType[] = [
      { ...dummyProductObject, price: "39.95", qty: 2 },
    ];
    const deal: addDealType = {
      ...dummyDealObject,
      discount: 10, // 10%
    };
    const result = calculatePrice(item, deal);
    // 10% discount : 39.95 * 0.9 = 35.955 -> 35.96
    // 35.96 * 2 = 71.92
    // tax 0.15% : 71.92 * 0.15 = 10.788 -> 10.79
    expect(result).toEqual({
      itemPrice: "71.92",
      shippingPrice: "10.00", // under $100
      taxPrice: "10.79", // tax 0.15%
      totalPrice: "92.71",
    });
  });
  it("sets shipping fee to 0 when item price is 100 or more", async () => {
    const item: CartItemType[] = [
      { ...dummyProductObject, price: "10", qty: 10 },
    ];
    const result = calculatePrice(item);
    expect(result.shippingPrice).toBe("0.00");
  });
  it("applies 10 shipping fee when item price is less than 100", async () => {
    const item: CartItemType[] = [
      { ...dummyProductObject, price: "39", qty: 1 },
    ];
    const result = calculatePrice(item);
    expect(result.shippingPrice).toBe("10.00");
  });
});
