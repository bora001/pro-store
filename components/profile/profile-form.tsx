"use client";

import { userProfileSchema } from "@/lib/validator";
import { userProfileType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateUserProfile } from "@/lib/actions/user.action";
import { useSession } from "next-auth/react";

const ProfileForm = () => {
  const { data, update } = useSession();
  const form = useForm<userProfileType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: data?.user?.name || "",
      email: data?.user?.email || "",
    },
  });
  const onSubmit = async (values: userProfileType) => {
    const response = await updateUserProfile(values);
    if (response.success) {
      update({ ...data, user: { ...data?.user, ...values } });
    } else {
      form.setError("email", { message: response.message });
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Input placeholder="name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Input placeholder="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="col-span-2 w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
