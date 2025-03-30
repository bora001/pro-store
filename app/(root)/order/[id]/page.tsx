import OrderDetail from "@/components/order/order-detail";
import { getOrderInfo } from "@/lib/actions/order.actions";
import { Shipping } from "@/types";
import { notFound } from "next/navigation";
import { PaymentFormType } from "@/components/payment/payment-form";
import { auth } from "@/auth";
import { CONSTANTS } from "@/lib/constants";

export const metadata = {
  title: "Order",
};
const OrderInfoPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const session = await auth();
  const order = await getOrderInfo(id);
  if (!order.data) notFound();

  return (
    <>
      <OrderDetail
        isAdmin={session?.user.role === CONSTANTS.ADMIN}
        clientId={process.env.PAYPAL_CLIENT_ID || ""}
        order={{
          ...order.data,
          address: order.data.address as Shipping,
          payment: order.data.payment as PaymentFormType["type"],
        }}
      />
    </>
  );
};

export default OrderInfoPage;
