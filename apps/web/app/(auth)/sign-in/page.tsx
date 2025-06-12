import CredentialSignInForm from "./credential-sign-in-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoContent from "@/components/common/logoContent";
import { PATH } from "@/lib/constants";

const SignInPage = async (props: { searchParams: Promise<{ callbackUrl: string }> }) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackUrl || PATH.HOME);
  }
  return (
    <LogoContent title="Sign In">
      <CredentialSignInForm />
    </LogoContent>
  );
};

export default SignInPage;
