import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating?.toString();
        },
      },
    },
    order: {
      itemPrice: {
        needs: { itemPrice: true },
        compute(order) {
          return order.itemPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(order) {
          return order.totalPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(order) {
          return order.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(order) {
          return order.taxPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        needs: { price: true },
        compute(orderItem) {
          return orderItem.price.toString();
        },
      },
    },
  },
});
