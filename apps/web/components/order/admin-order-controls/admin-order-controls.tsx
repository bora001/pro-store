import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import AdminControlButton from "../admin-control";
import { PaymentResultSchemaType } from "@/types";
import { updateOrderToDelivered, updateOrderToPaidByAdmin } from "@/lib/actions/handler/admin/admin.order.actions";
type AdminOrderControlsPropsType = {
  isPaid: boolean;
  isDelivered: boolean;
  pricePaid: string;
  id: string;
};
const AdminOrderControls = ({ id, isPaid, isDelivered, pricePaid }: AdminOrderControlsPropsType) => {
  const paymentResult: PaymentResultSchemaType = { status: "", id, pricePaid, email_address: "" };
  const AdminOrderControlButtons = [
    {
      key: "paid Controls",
      disabled: isPaid,
      title: ["Mark as Paid", "Paid"],
      action: () => updateOrderToPaidByAdmin({ orderId: id, paymentResult }),
    },
    {
      key: "delivery Controls",
      disabled: isDelivered,
      title: ["Mark as Delivered", "Delivered"],
      action: () => updateOrderToDelivered(id),
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex gap-2 items-center">
          <Wrench size={18} />
          <p>Admin Controls</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-wrap flex gap-2">
        {AdminOrderControlButtons.map(({ key, disabled, title, action }) => (
          <AdminControlButton key={key} {...{ disabled, title, action }} />
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminOrderControls;
