import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const BENEFITS = [
  {
    title: "Free Shipping",
    desc: "Free shipping on orders above $100",
    icon: <ShoppingBag />,
  },
  {
    title: "Money Back Guarantee",
    desc: "Within 30 days of purchase",
    icon: <DollarSign />,
  },
  {
    title: "Flexible Payment",
    desc: "Pay with Stripe, PayPal or Cash",
    icon: <WalletCards />,
  },
  {
    title: "24/7 Support",
    desc: "Get support at any time",
    icon: <Headset />,
  },
];
const ShoppingBenefits = () => {
  return (
    <Card>
      <CardContent className="grid md:grid-cols-4 gap-4 p-4">
        {BENEFITS.map(({ title, desc, icon }) => (
          <div className="text-sm space-y-3" key={title}>
            {icon}
            <div className="space-y-1">
              <div className="font-bold">{title}</div>
              <div className="text-muted-foreground">{desc}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ShoppingBenefits;
