import Text from "../custom/text";
import { cn } from "@/lib/utils";

const OriginalPrice = ({ price, isEnd }: { isEnd: boolean; price: string }) => {
  return (
    <div className={cn("text-xl leading-[1] items-center", "line-through text-gray-500", !isEnd ? "flex" : "hidden")}>
      <Text size="xs" className="mr-1">
        {price}
      </Text>
    </div>
  );
};

export default OriginalPrice;
