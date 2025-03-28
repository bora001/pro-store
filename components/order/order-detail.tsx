"use client";
import { Order } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Flex from "../common/flex";
import ProductTable from "../common/product-table";
import PriceSummary from "../common/price-summary";

const OrderDetail = ({ order }: { order: Order }) => {
  const {
    address,
    orderItems,
    payment,
    isDelivered,
    itemPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;
  return (
    <>
      <h1 className="py-4 text-2xl">
        Order{" "}
        <span className="text-gray-500 text-base"># {order.id.slice(-10)}</span>
      </h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          {/* payment */}
          <Card>
            <CardContent className="p-4 gap-4">
              <Flex className="gap-3 pb-4">
                <h2 className="text-xl">Payment Method</h2>
                {isPaid ? (
                  <Badge variant="secondary">Paid at {String(paidAt)}</Badge>
                ) : (
                  <Badge variant="destructive">unpaid</Badge>
                )}
              </Flex>
              <p>{payment}</p>
            </CardContent>
          </Card>
          {/* shipping */}
          <Card>
            <CardContent className="p-4 gap-4">
              <Flex className="gap-3 pb-4">
                <h2 className="text-xl">Shipping Address</h2>
                {isDelivered ? (
                  <Badge variant="secondary">
                    Delivered at {String(deliveredAt)}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Delivered</Badge>
                )}
              </Flex>
              <p>
                {address.address} {address.city} {address.postalCode}{" "}
                {address.country}
              </p>
            </CardContent>
          </Card>
          {/* order-items */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl">Order Items</h2>
              <ProductTable items={orderItems} isView />
            </CardContent>
          </Card>
        </div>
        {/* price-summary */}
        <PriceSummary
          itemPrice={itemPrice}
          taxPrice={taxPrice}
          shippingPrice={shippingPrice}
          totalPrice={totalPrice}
        />
      </div>
    </>
  );
};

export default OrderDetail;
