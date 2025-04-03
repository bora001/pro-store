"use client";

import { addReviewSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormInput from "../common/form-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Star } from "lucide-react";
import { addOrEditReview } from "@/lib/actions/review.actions";
import { toast } from "@/hooks/use-toast";
import { CONSTANTS } from "@/lib/constants";
type ReviewFormType = "create" | "edit";
type ReviewFormPropsReview = {
  title: string;
  description: string;
  rating: number;
};
const ReviewForm = ({
  type = "create",
  userId,
  productId,
  button,
  review,
}: {
  type?: ReviewFormType;
  userId?: string;
  productId: string;
  button: ReactNode;
  review?: ReviewFormPropsReview;
}) => {
  const isEdit = type === "edit";
  const [open, setOpen] = useState(false);
  const defaultValues = {
    productId,
    userId,
    title: review?.title || "",
    description: review?.description || "",
    rating: review?.rating || CONSTANTS.AVG_REVIEW_RATING,
  };

  const form = useForm<z.infer<typeof addReviewSchema>>({
    resolver: zodResolver(addReviewSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof addReviewSchema>) => {
    const { success, message } = await addOrEditReview({
      ...values,
      productId,
    });
    toast({
      variant: success ? "default" : "destructive",
      description: message,
    });
    if (success) setOpen(false);
  };

  useEffect(() => {
    if (!open) form.reset(defaultValues);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        className="p-0"
        onClick={() => setOpen(true)}
        asChild
      >
        {button}
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit" : "Write a"} review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormInput
                control={form.control}
                placeholder="Enter Title"
                name="title"
              />
              <FormInput
                type="textarea"
                control={form.control}
                placeholder="Enter Description"
                name="description"
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }, (v, i) => i + 1).map(
                          (role) => (
                            <SelectItem key={role} value={role.toString()}>
                              <div className="flex">
                                {new Array(role).fill(null).map((_, i) => (
                                  <Star key={i} fill="gold" color="gold" />
                                ))}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {isEdit ? "Edit" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
