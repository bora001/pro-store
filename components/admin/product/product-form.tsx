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
import { capitalize } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";
import ProductFormImageInput from "./product-form-image-input";

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
  const [files, setFiles] = useState<File[]>([]);
  const [banners, setBanners] = useState<File[]>([]);
  const router = useRouter();
  const isEdit = type === "edit";
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: isEdit
      ? zodResolver(updateProductSchema)
      : zodResolver(insertProductSchema),
    defaultValues: product && isEdit ? product : defaultValue,
  });

  const handleUpload = async (folder: string, files: File[]) => {
    if (!files.length) return [];

    const uploadPromises = files.map((file) => {
      return new Promise<string>(async (resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onerror = () => {
          console.error("FileReader error:", reader.error);
          reject("File reading failed");
        };

        reader.onloadend = async () => {
          const base64File = reader.result?.toString().split(",")[1];
          if (!base64File) {
            console.error("Base64 conversion failed");
            reject("Error : Base64 conversion failed!");
            return;
          }

          try {
            const response = await fetch(PATH.API_UPLOAD_IMAGE, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                file: base64File,
                fileName: file.name,
                fileType: file.type,
                folder,
              }),
            });

            const responseBody = await response.text();
            const result = responseBody ? JSON.parse(responseBody) : null;

            if (response.ok) {
              resolve(result?.fileName || file.name);
            } else {
              reject(
                result?.error || `Upload failed (status: ${response.status})`
              );
            }
          } catch (error) {
            console.error("Upload error:", error);
            reject(error);
          }
        };
      });
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    } catch (error) {
      console.error("Upload failed:", error);
      return [];
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = { ...values };
    if (!images.length) {
      if (!files.length) {
        return form.setError("images", {
          message: "Product must have at least one image",
        });
      }
      const uploadedFiles = await handleUpload("product", files);
      if (!uploadedFiles.length) return;
      formData.images = uploadedFiles;
    }
    if (banners.length) {
      const uploadedBanners = await handleUpload("banner", banners);
      formData.banner = uploadedBanners[0];
    }
    if (isEdit && !productId) {
      router.push(PATH.PRODUCTS);
      return;
    }
    const { success, message } = isEdit
      ? await updateProduct({ ...formData, id: productId! })
      : await createProduct(formData);

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
                  <CardContent className="space-y-2 mt-2">
                    <ProductFormImageInput
                      folder="product"
                      files={files}
                      setFiles={setFiles}
                      images={images}
                    />
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* feature */}
        <div>
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
              {isFeatured && (
                <ProductFormImageInput
                  noMultiple
                  folder="banner"
                  files={banners}
                  setFiles={setBanners}
                  width={1920}
                  height={562}
                  images={banner ? [banner] : []}
                />
              )}
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
