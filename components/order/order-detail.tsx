"use client";
import { OrderType, PaymentResultType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import Flex from "../common/flex";
import ProductTable from "../common/product-table";
import PriceSummary from "../common/price-summary";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { approvalPaypalOrder, createPaypalOrder, sendEmailReceipt } from "@/lib/actions/handler/order.actions";
import { toast } from "@/hooks/use-toast";
import { dateTimeConverter, idSlicer } from "@/lib/utils";
import { AdminControlButton } from "./admin-control";
import { updateOrderToDelivered, updateOrderToPaidByAdmin } from "@/lib/actions/handler/admin/admin.order.actions";
import StripePayment from "./stripe-payment";
import { Mail, Wrench } from "lucide-react";
import IconButton from "../custom/icon-button";
import { useTransition } from "react";

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
  const paymentMethod: PaymentResultType = { status: "", id, pricePaid: totalPrice, email_address: "" };
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
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          {/* payment */}
          <Card>
            <CardContent className="p-4 gap-4">
              <Flex className="gap-3 pb-4">
                <h2 className="text-xl">Payment Method</h2>
                {isPaid ? (
                  <Badge variant="secondary">Paid at {dateTimeConverter(paidAt)}</Badge>
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
                  <Badge variant="secondary">Delivered at {dateTimeConverter(deliveredAt)}</Badge>
                ) : (
                  <Badge variant="destructive">Not Delivered</Badge>
                )}
              </Flex>
              <p>
                {address.address}, {address.city}, {address.postalCode}, {address.country}
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
        <div className="space-y-4">
          <PriceSummary
            itemPrice={itemPrice}
            taxPrice={taxPrice}
            shippingPrice={shippingPrice}
            totalPrice={totalPrice}
          />
          {/* paypal-payment */}
          {!isPaid && payment === "PayPal" && (
            <>
              <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                <LoadingPaypal />
                <PayPalButtons createOrder={handleCreatePaypalOrder} onApprove={handleApprovePaypalOrder} />
              </PayPalScriptProvider>
            </>
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
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex gap-2 items-center">
                  <Wrench size={18} />
                  <p>Admin Controls</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-x-2">
                <AdminControlButton
                  disabled={isPaid}
                  title={["Mark as Paid", "Paid"]}
                  action={() =>
                    updateOrderToPaidByAdmin({
                      orderId: id,
                      paymentResult: paymentMethod,
                    })
                  }
                />
                <AdminControlButton
                  disabled={isDelivered}
                  title={["Mark as Delivered", "Delivered"]}
                  action={() => updateOrderToDelivered(id)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
