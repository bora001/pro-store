import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Badge } from "../ui/badge";

const DiscountBadge = ({
  discount,
  className,
}: {
  discount: number;
  className?: ClassValue;
}) => {
  return (
    <Badge variant="destructive" className={cn("cursor-default", className)}>
      {discount}% OFF
    </Badge>
  );
};

export default DiscountBadge;
