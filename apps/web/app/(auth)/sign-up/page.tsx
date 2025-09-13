import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoContent from "@/components/common/logoContent";
import SignUpForm from "./sign-up-form";
import { PATH } from "@/lib/constants";

const SignInPage = async (props: { searchParams: Promise<{ callbackUrl: string }> }) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackUrl || PATH.HOME);
  }
  return (
    <LogoContent title="Create Account">
      <SignUpForm />
    </LogoContent>
  );
};

export default SignInPage;
