import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const Flex = ({
  children,
  className,
  isFull,
}: {
  children: ReactNode;
  className?: string;
  isFull?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex  items-center ",
        isFull && "h-screen w-screen",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Flex;
