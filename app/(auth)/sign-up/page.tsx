import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoContent from "@/components/common/logoContent";
import SignUpForm from "./sign-up-form";

const SignInPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackUrl || "/");
  }
  return (
    <LogoContent title="Create Account">
      <SignUpForm />
    </LogoContent>
  );
};

export default SignInPage;
