import { cn, divideByDecimal } from "@/lib/utils";
import Text from "../custom/Text";

const ProductPrice = ({
  unit = "$",
  price,
  className,
}: {
  unit?: string;
  price: string;
  className?: string;
}) => {
  const [whole, fraction] = divideByDecimal(+price);
  return (
    <div className={cn("text-xl flex leading-[1]", className)}>
      <Text size="xs">{unit}</Text> {whole}
      <Text size="xs">.{fraction}</Text>
    </div>
  );
};

export default ProductPrice;
