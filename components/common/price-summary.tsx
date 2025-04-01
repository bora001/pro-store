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
  const PRICE_SUMMARY = [
    { title: "Items", value: itemPrice },
    { title: "Tax", value: taxPrice },
    { title: "Shipping", value: shippingPrice },
    { title: "Total", value: totalPrice },
  ];
  return (
    <Card>
      <CardContent className="p-4 gap-4 space-y-4">
        {PRICE_SUMMARY.map(({ title, value }) => (
          <div className="flex justify-between" key={title}>
            <div className="font-semibold">{title}</div>
            <div>{currencyFormatter.format(+value)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
