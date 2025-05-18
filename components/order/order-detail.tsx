"use client";
import { OrderType } from "@/types";
import { Card, CardContent } from "../ui/card";
import ProductTable from "../common/product-table";
import PriceSummary from "../common/price-summary";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { approvalPaypalOrder, createPaypalOrder, sendEmailReceipt } from "@/lib/actions/handler/order.actions";
import { toast } from "@/hooks/use-toast";
import { idSlicer } from "@/lib/utils";
import StripePayment from "./stripe-payment";
import { Mail } from "lucide-react";
import IconButton from "../custom/icon-button";
import { useTransition } from "react";
import AdminOrderControls from "./admin-order-controls/admin-order-controls";
import OrderDetailCard from "./order-detail-card";

type OrderDetailPropsType = {
  isAdmin?: boolean;
  order: Omit<OrderType, "paymentResult">;
  paypalClientId: string;
  stripeClientSecret: string | null;
};
const OrderDetail = ({ isAdmin = false, order, paypalClientId, stripeClientSecret }: OrderDetailPropsType) => {
  const [isPending, startTransition] = useTransition();
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
    id,
  } = order;
  const handleCreatePaypalOrder = async () => {
    const response = await createPaypalOrder(order.id);
    if (!response.success) toast({ variant: "destructive", description: String(response.message) });
    return response.data;
  };
  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const response = await approvalPaypalOrder({ orderId: order.id, data });
    toast({ variant: response.success ? "default" : "destructive", description: String(response.message) });
  };

  const LoadingPaypal = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) status = "Loading Paypal..";
    if (isRejected) status = "Loading Paypal Rejected";
    return status;
  };

  const sendEmail = () => {
    startTransition(async () => {
      const response = await sendEmailReceipt(id);
      toast({ variant: response.success ? "default" : "destructive", description: String(response.message) });
    });
  };

  return (
    <>
      <h1 className="py-4 text-2xl">
        Order <span className="text-gray-500 text-base"># {idSlicer(order.id)}</span>
      </h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          {/* payment */}
          <OrderDetailCard
            title="Payment Method"
            status={isPaid}
            badgeTitle={["Paid at", "unpaid"]}
            date={paidAt}
            detail={payment}
          />
          {/* shipping */}
          <OrderDetailCard
            title="Shipping Address"
            status={isDelivered}
            badgeTitle={["Delivered at", "Not Delivered"]}
            date={deliveredAt}
            detail={`${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`}
          />
          {/* order-items */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl">Order Items</h2>
              <ProductTable items={orderItems} isView />
            </CardContent>
          </Card>
        </div>
        {/* price-summary */}
        <div className="space-y-4 col-span-2 md:col-span-1">
          <PriceSummary
            itemPrice={itemPrice}
            taxPrice={taxPrice}
            shippingPrice={shippingPrice}
            totalPrice={totalPrice}
          />
          {/* paypal-payment */}
          {!isPaid && payment === "PayPal" && (
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <LoadingPaypal />
              <PayPalButtons createOrder={handleCreatePaypalOrder} onApprove={handleApprovePaypalOrder} />
            </PayPalScriptProvider>
          )}
          {/* stripe-payment */}
          {!isPaid && payment === "Stripe" && stripeClientSecret && (
            <StripePayment orderId={order.id} priceInCents={order.totalPrice} clientSecret={stripeClientSecret} />
          )}
          {/* email-receipt */}
          {order.paidAt && (
            <IconButton
              disabled={isPending}
              onClick={sendEmail}
              variant="default"
              className="w-full"
              text="Send Receipt"
              icon={<Mail />}
            />
          )}
          {/* admin : cash-on-delivery */}
          {isAdmin && <AdminOrderControls {...{ isPaid, isDelivered, pricePaid: totalPrice, id }} />}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
