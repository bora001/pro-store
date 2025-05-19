import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
const Text = ({ size = "base", className, children }: { size: TextSize; className?: string; children: ReactNode }) => {
  return <p className={cn(className, `text-${size}`)}>{children}</p>;
};

export default Text;
