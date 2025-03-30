import { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { PATH } from "@/lib/constants";

const LinkButton = ({
  icon,
  title,
  url = PATH.HOME,
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
