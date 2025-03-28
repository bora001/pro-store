import { currencyFormatter } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
type PriceSummaryType = {
  itemPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
};
const PriceSummary = ({
  itemPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
}: PriceSummaryType) => {
  return (
    <Card>
      <CardContent className="p-4 gap-4 space-y-4">
        <div className="flex justify-between">
          <div>Items</div>
          <div>{currencyFormatter.format(+itemPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Tax</div>
          <div>{currencyFormatter.format(+taxPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Shipping</div>
          <div>{currencyFormatter.format(+shippingPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Total</div>
          <div>{currencyFormatter.format(+totalPrice)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
