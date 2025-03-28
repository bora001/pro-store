import { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const LinkButton = ({
  icon,
  title,
  url = "/",
  ...props
}: {
  icon?: ReactNode;
  title: string;
  url: string;
}) => {
  return (
    <Button {...props}>
      <Link href={url} className="flex gap-3 items-center">
        {icon}
        <p>{title}</p>
      </Link>
    </Button>
  );
};

export default LinkButton;
