"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { editUserSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATH, USER_ROLE } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { editUserProfile } from "@/lib/actions/user.action";
import { editUserType } from "@/types";
import { capitalize } from "@/lib/utils";

const EditUserForm = ({ user }: { user: editUserType }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: user,
  });
  const onSubmit = form.handleSubmit(async (values) => {
    const { success, message } = await editUserProfile(values);
    if (!success) {
      toast({ variant: "destructive", description: message });
      return;
    }
    router.replace(PATH.USERS);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormInput placeholder="Enter Email" name="email" />
        <FormInput placeholder="Enter Name" name="name" />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLE.map((role) => (
                    <SelectItem key={role} value={role}>
                      {capitalize(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* submit */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Submitting" : `Edit`}
        </Button>
      </form>
    </Form>
  );
};

export default EditUserForm;
