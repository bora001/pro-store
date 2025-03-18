import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ReactNode } from "react";
import Flex from "./flex";
import LogoImage from "./logo";
import Link from "next/link";

const LogoContent = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Flex className="flex-start gap-4">
            <Link href="/">
              <LogoImage />
            </Link>
            <CardTitle>{title}</CardTitle>
          </Flex>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default LogoContent;
