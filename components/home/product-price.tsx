import { cn } from "@/lib/utils";
import Text from "../custom/Text";

const ProductPrice = ({
  unit = "$",
  price,
  className,
}: {
  unit?: string;
  price: number;
  className?: string;
}) => {
  const [whole, fraction] = price.toFixed(2).split(".");
  return (
    <p className={cn("text-xl flex leading-[1]", className)}>
      <Text size="xs">{unit}</Text> {whole}
      <Text size="xs">.{fraction}</Text>
    </p>
  );
};

export default ProductPrice;
