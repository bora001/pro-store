"use client";

import FormSubmitButton from "@/components/custom/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { signUpUser } from "@/lib/actions/user.action";
import { PATH } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const SignUpForm = () => {
  const callbackUrl = useSearchParams().get("callbackUrl");
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });
  return (
    <form className="space-y-5" action={action}>
      <div className="space-y-3">
        <Input
          type="hidden"
          name="callbackUrl"
          value={callbackUrl || PATH.HOME}
        />
        <Input
          type="text"
          name="name"
          placeholder="name"
          required
          defaultValue={((data && data.data && data.data.name) as string) || ""}
        />
        <Input
          defaultValue={
            ((data && data.data && data.data.email) as string) || ""
          }
          type="email"
          name="email"
          placeholder="email@example.com"
          required
        />
        <Input type="password" name="password" placeholder="password" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="confirmPassword"
        />
      </div>
      <FormSubmitButton text={["Submitting...", "Sign up"]} />
      <p className="text-center text-destructive text-sm">
        {data && data.message}
      </p>
      <div className="text-sm text-center text-muted-foreground">
        Already Have an account? <Link href={PATH.SIGN_IN}>Sign in</Link>
      </div>
    </form>
  );
};

export default SignUpForm;
