import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  text?: string;
}
const IconButton = ({
  className,
  icon,
  text,
  variant = "ghost",
  onClick,
}: IconButtonProps) => {
  return (
    <Button variant={variant} className={className} onClick={onClick}>
      {icon} {text}
    </Button>
  );
};

export default IconButton;
