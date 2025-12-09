"use client";

import Center from "@/components/common/center";
import LogoImage from "@/components/common/logo";
import LinkButton from "@/components/custom/link-button";
import { Button } from "@/components/ui/button";
import { PATH } from "@/lib/constants";

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <Center isFull className="flex-col gap-5">
      <LogoImage />
      <p className="font-bold text-xl">Error</p>
      <p className="text-sm text-gray-600">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try Again</Button>
        <LinkButton {...{ variant: "secondary" }} title="Back To Home" url={PATH.HOME} />
      </div>
    </Center>
  );
};

export default Error;
