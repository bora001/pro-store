"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import { signUpSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { generateCode } from "@/utils/random-code";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import FormSubmitButton from "@/components/custom/FormSubmitButton";
import { sendEmailVerification } from "@/lib/email/mail-handler";
import { checkDuplicateEmail, signUpUser } from "@/lib/actions/handler/user.action";
import { SignUpSchemaType } from "@/types";

const defaultValues = { name: "", email: "", password: "", confirmPassword: "", code: "" };

const SignUpForm = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const form = useForm<SignUpSchemaType>({ resolver: zodResolver(signUpSchema), defaultValues });

  const isValidEmail = async (email: string) => {
    const isValid = await form.trigger("email");
    if (!isValid) return false;
    const { success, message } = await checkDuplicateEmail(email);
    if (!success) toast({ variant: "destructive", description: message });
    return success;
  };

  const handleSendEmail = async () => {
    const email = form.getValues("email");
    const validEmail = await isValidEmail(email);
    setEmailSent(validEmail);
    if (!validEmail) return;

    const token = generateCode();
    setUserCode(token);
    const { success, message } = await sendEmailVerification({ email, token });

    if (!success) {
      toast({ variant: "destructive", description: message });
      setEmailSent(false);
    } else {
      toast({ description: "An email has been sent. Please check your inbox and spam folder" });
    }
  };

  const verifyCode = () => {
    if (userCode !== form.getValues("code")) {
      form.setError("code", { message: "Invalid code" });
    } else {
      setCodeVerified(true);
      form.clearErrors("code");
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const { success, message } = await signUpUser(values);
    if (!success) return toast({ variant: "destructive", description: message });
  });

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-3">
          <FormInput placeholder="Enter Name" name="name" />
          <div className={cn("flex relative items-end", form.formState.errors.email ? "items-center" : "items-end")}>
            <FormInput placeholder="email@example.com" name="email" disabled={emailSent || codeVerified} />
            {!emailSent && (
              <Button type="button" onClick={handleSendEmail} disabled={emailSent}>
                Verify
              </Button>
            )}
          </div>

          {emailSent && !codeVerified && (
            <div className={cn("flex items-end", form.formState.errors.code ? "items-center" : "items-end")}>
              <FormInput placeholder="Verification Code" name="code" />
              <Button type="button" onClick={verifyCode}>
                Verify Code
              </Button>
            </div>
          )}

          <FormInput placeholder="Password" name="password" type="password" />
          <FormInput placeholder="Confirm Password" name="confirmPassword" type="password" />
        </div>
        <FormSubmitButton
          type="submit"
          disabled={!codeVerified || form.formState.isSubmitting}
          text={["Submitting...", "Sign up"]}
        />
      </form>
    </Form>
  );
};

export default SignUpForm;
