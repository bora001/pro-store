import { discountPrice } from "@/utils/price/discountPrice";

describe("discountPrice", () => {
  it("returns discounted price correctly with condition = true", () => {
    const result = discountPrice(100, 10, true); // 100 * 0.9 = 90.00
    expect(result).toBe(90.0);
  });

  it("rounds to two decimal places", () => {
    const result = discountPrice(39.95, 10, true); // 39.95 * 0.9 = 35.955 -> 35.96
    expect(result).toBe(35.96);
  });

  it("returns original price if discount is not provided", () => {
    const result = discountPrice(50, undefined, true);
    expect(result).toBe(50);
  });

  it("returns original price if condition is false", () => {
    const result = discountPrice(100, 10, false);
    expect(result).toBe(100);
  });

  it("returns original price if both discount and condition are missing", () => {
    const result = discountPrice(80);
    expect(result).toBe(80);
  });
});
