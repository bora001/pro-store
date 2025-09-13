import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

type BodyProps = {
  className?: ClassValue;
  children: ReactNode;
};
const Body = ({ children, className }: BodyProps) => {
  return <div className={cn("h-full", className)}>{children}</div>;
};

export default Body;
