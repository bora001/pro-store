"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createProduct, updateProduct } from "@/lib/actions/admin.actions";
import { CONSTANTS, PATH } from "@/lib/constants";
import { UploadButton } from "@/lib/uploadthing";
import { capitalize } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";

type ProductFormType = "create" | "edit";
const defaultValue = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: CONSTANTS.INIT_REVIEW_RATING,
  numReviews: 0,
  isFeatured: false,
  banner: null,
};
const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: ProductFormType;
  product?: z.infer<typeof insertProductSchema>;
  productId?: string;
}) => {
  const router = useRouter();
  const isEdit = type === "edit";
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: isEdit
      ? zodResolver(updateProductSchema)
      : zodResolver(insertProductSchema),

    defaultValues: product && isEdit ? product : defaultValue,
  });
  const onSubmit = form.handleSubmit(async (values) => {
    if (isEdit && !productId) {
      router.push(PATH.PRODUCTS);
      return;
    }
    const { success, message } = isEdit
      ? await updateProduct({ ...values, id: productId! })
      : await createProduct(values);

    if (!success) {
      toast({ variant: "destructive", description: message });
      return;
    }
    router.replace(PATH.PRODUCTS);
  });

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* name & slug */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput
            control={form.control}
            placeholder="Enter Product Name"
            name="name"
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        )
                      }
                    >
                      Generate Slug
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* category & brand */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput
            control={form.control}
            placeholder="Enter Category"
            name="category"
          />
          <FormInput
            control={form.control}
            placeholder="Enter Brand"
            name="brand"
          />
        </div>
        {/* price & stock */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput
            control={form.control}
            placeholder="Enter Price"
            name="price"
            type="number"
          />
          <FormInput
            control={form.control}
            placeholder="Enter Stock"
            name="stock"
            type="number"
          />
        </div>
        {/* image */}
        <div className="flex flex-col gap-5 md:flex-row upload-field">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image) => (
                        <Image
                          key={String(image)}
                          src={String(image)}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) =>
                            form.setValue("images", [...images, res[0].url])
                          }
                          onUploadError={(error) => {
                            toast({
                              variant: "destructive",
                              description: error.message,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* feature */}
        <div className="upload-field">
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* isFeatured */}
              {isFeatured &&
                (banner ? (
                  <Image
                    src={banner}
                    alt="banner image"
                    width={1920}
                    height={680}
                    className="w-full object-cover object-center rounded-sm"
                  />
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) =>
                      form.setValue("banner", res[0].url)
                    }
                    onUploadError={(error) => {
                      toast({
                        variant: "destructive",
                        description: error.message,
                      });
                    }}
                  />
                ))}
            </CardContent>
          </Card>
        </div>
        {/* description */}
        <FormInput
          type="textarea"
          control={form.control}
          placeholder="Enter Product Description"
          name="description"
        />
        {/* submit */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Submitting"
            : `${capitalize(type)} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
