"use client";

import FormSubmitButton from "@/components/custom/form-submit-button";
import { Input } from "@/components/ui/input";
import { signInUser } from "@/lib/actions/handler/user.action";
import { PATH } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const CredentialSignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [data, action] = useActionState(signInUser, { success: false, message: "" });

  return (
    <form className="space-y-5" action={action}>
      <div className="space-y-3">
        <Input type="hidden" name="callbackUrl" value={callbackUrl || PATH.HOME} />
        <Input
          defaultValue={(data?.data?.email as string) || ""}
          type="email"
          name="email"
          placeholder="email@example.com"
          required
        />
        <Input type="password" name="password" placeholder="password" autoComplete="off" required />
      </div>
      <FormSubmitButton text={["Signing...", "Sign In"]} />
      <p className="text-center text-destructive text-sm">{data && data.message}</p>
      <div className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account? <Link href={PATH.SIGN_UP}>Sign up</Link>
      </div>
    </form>
  );
};

export default CredentialSignInForm;
