import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
export type EmptyBoxPropsType = {
  title: string;
  href?: string;
  linkText?: string;
};
const EmptyBox = ({ title, href, linkText }: EmptyBoxPropsType) => {
  return (
    <div className="flex-1 justify-center gap-3 w-full h-full flex flex-col items-center">
      <PackageOpen size={36} />
      <span>{title}</span>

      {href && linkText && (
        <Link href={href}>
          <Button>{linkText}</Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyBox;
