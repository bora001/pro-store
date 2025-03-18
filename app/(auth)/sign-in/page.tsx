import CredentialSignInForm from "./credential-sign-in-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoContent from "@/components/common/logoContent";

const SignInPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackUrl || "/");
  }
  return (
    <LogoContent title="Sign In">
      <CredentialSignInForm />
    </LogoContent>
  );
};

export default SignInPage;
