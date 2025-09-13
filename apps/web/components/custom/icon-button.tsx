import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  text?: string;
}
const IconButton = ({ className, icon, text, variant = "ghost", onClick, ...props }: IconButtonProps) => {
  return (
    <Button
      {...props}
      variant={variant}
      className={cn(className, variant === "default" && "hover:text-white")}
      onClick={onClick}
    >
      {icon} {text}
    </Button>
  );
};

export default IconButton;
