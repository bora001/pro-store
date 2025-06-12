import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

const VARIANT_COLORS = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
} as const;
const POSITION_CLASSES = {
  "top-right": "-top-2 right-2",
  "top-left": "-top-2 left-2",
  "bottom-right": "-bottom-2 right-2",
  "bottom-left": "-bottom-2 left-2",
} as const;

type Variant = keyof typeof VARIANT_COLORS;
type Position = keyof typeof POSITION_CLASSES;

const ProductBadge = ({
  className,
  text,
  variant = "red",
  position = "top-right",
}: {
  className?: ClassNameValue;
  text: string;
  variant?: Variant;
  position?: Position;
}) => {
  return (
    <div
      className={cn(
        VARIANT_COLORS[variant],
        POSITION_CLASSES[position],
        "absolute text-white font-semibold px-2 py-3 rounded-lg shadow-md",
        className
      )}
    >
      {text}
    </div>
  );
};

export default ProductBadge;
