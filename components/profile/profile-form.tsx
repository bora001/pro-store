"use client";

import { userProfileSchema } from "@/lib/validator";
import { UserProfileSchemaType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { deleteUserAccount, updateUserProfile } from "@/lib/actions/handler/user.action";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import DeleteButton from "../common/delete-button";
import { PATH } from "@/lib/constants";
const ProfileForm = () => {
  const router = useRouter();
  const { data, update } = useSession();
  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: { name: data?.user?.name || "", email: data?.user?.email || "" },
  });
  const onSubmit = async (values: UserProfileSchemaType) => {
    const response = await updateUserProfile(values);
    if (response.success) {
      await update({ ...data, user: { ...data?.user, ...values } });
      router.refresh();
    } else {
      form.setError("email", { message: response.message });
    }
  };
  if (!data?.user.id) return notFound();

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
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

          <Button type="submit" className="col-span-2 w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
          </Button>
          <DeleteButton
            variant="destructive"
            type="button"
            id={data.user.id}
            returnPath={PATH.HOME}
            action={deleteUserAccount}
            buttonLabel="delete-user-button"
            title="Delete Account"
          />
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
