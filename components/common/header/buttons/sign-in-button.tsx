import LinkButton from "@/components/custom/LinkButton";
import { PATH } from "@/lib/constants";
import { UserIcon } from "lucide-react";

const SignInButton = () => {
  return (
    <LinkButton
      icon={<UserIcon />}
      title="Sign In"
      url={PATH.SIGN_IN}
      className="w-full"
    />
  );
};

export default SignInButton;
