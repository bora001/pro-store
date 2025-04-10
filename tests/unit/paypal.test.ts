import { generateAccessToken, paypal } from "@/lib/paypal";

describe("PayPal API", () => {
  test("generates token from paypal", async () => {
    const tokenResponse = await generateAccessToken();
    expect(typeof tokenResponse).toBe("string");
    expect(tokenResponse.length).toBeGreaterThan(0);
  });

  test("creates a paypal order", async () => {
    const randomPrice = Math.floor(Math.random() * 1001);
    const orderResponse = await paypal.createOrder(randomPrice);
    expect(orderResponse).toHaveProperty("id");
    expect(orderResponse).toHaveProperty("status");
    expect(orderResponse.status).toBe("CREATED");
  });

  test("simulates capturing a payment from an order", async () => {
    const orderId = `1PR${Math.floor(Math.random() * 100000000000000)}`;
    const mockCapturePayment = jest
      .spyOn(paypal, "capturePayment")
      .mockResolvedValue({
        status: "COMPLETE",
      });
    const captureResponse = await paypal.capturePayment(orderId);
    expect(captureResponse).toHaveProperty("status", "COMPLETE");
    mockCapturePayment.mockRestore();
  });
});
