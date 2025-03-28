import Center from "@/components/common/center";
import LogoImage from "@/components/common/logo";
import LinkButton from "@/components/custom/LinkButton";
import { PATH } from "@/lib/constants";

const NotFoundPage = () => {
  return (
    <Center isFull className="flex-col gap-5">
      <LogoImage />
      <p className="font-bold text-xl">Not Found</p>
      <LinkButton
        {...{ variant: "secondary" }}
        title="Back To Home"
        url={PATH.HOME}
      />
    </Center>
  );
};

export default NotFoundPage;
