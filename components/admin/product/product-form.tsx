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
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";
import ProductFormImageInput from "./product-form-image-input";
import { v4 as uuidv4 } from "uuid";

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
  deleteButton,
}: {
  type: ProductFormType;
  product?: z.infer<typeof insertProductSchema>;
  productId?: string;
  deleteButton?: ReactNode;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [banners, setBanners] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  const [deleteBanner, setDeleteBanner] = useState<string[]>([]);
  const router = useRouter();
  const isEdit = type === "edit";
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(isEdit ? updateProductSchema : insertProductSchema),
    defaultValues: product && isEdit ? product : defaultValue,
  });

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = () => reject("File reading failed");
      reader.onloadend = () => {
        const base64File = reader.result?.toString().split(",")[1];
        if (!base64File) return reject("Base64 conversion failed");
        resolve(base64File);
      };
    });
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base64File = await readFileAsBase64(file);
    const response = await fetch(PATH.API_UPLOAD_IMAGE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: base64File,
        fileName: `${uuidv4()}-${file.name}`,
        fileType: file.type,
        folder,
      }),
    });

    const responseBody = await response.text();
    const result = responseBody ? JSON.parse(responseBody) : null;
    if (response.ok) {
      return result?.fileName || file.name;
    } else {
      throw new Error(
        result?.error || `Upload failed (status: ${response.status})`
      );
    }
  };

  const handleUpload = async (
    folder: string,
    files: File[]
  ): Promise<string[]> => {
    if (!files.length) return [];
    try {
      const uploadPromises = files.map((file) => uploadFile(file, folder));
      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    } catch (error) {
      console.error("Upload failed:", error);
      return [];
    }
  };

  const handleDelete = async (folder: string, keys: string[]) => {
    await fetch(PATH.API_DELETE_IMAGE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys, folder }),
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = { ...values };

    // upload images
    if (files.length) {
      const uploadedFiles = await handleUpload("product", files);
      formData.images = [...formData.images, ...uploadedFiles];
    }
    // delete images
    if (deleteImages.length) {
      await handleDelete("product", deleteImages);
      formData.images = formData.images.filter(
        (image) => !deleteImages.some((deleteImage) => deleteImage === image)
      );
    }
    // upload banner
    if (banners.length) {
      const uploadedFiles = await handleUpload("banner", banners);
      formData.banner = uploadedFiles[0];
    }
    //delete banner
    if (deleteBanner.length) {
      await handleDelete("banner", deleteBanner);
      formData.banner = null;
    }

    // extra-validate
    if (!formData.images.length && !files.length) {
      return form.setError("images", {
        message: "Product must have at least one image",
      });
    }
    if (!formData.banner) formData.isFeatured = false;

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

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* name & slug */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput placeholder="Enter Product Name" name="name" />
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
          <FormInput placeholder="Enter Category" name="category" />
          <FormInput placeholder="Enter Brand" name="brand" />
        </div>
        {/* price & stock */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormInput placeholder="Enter Price" name="price" type="number" />
          <FormInput placeholder="Enter Stock" name="stock" type="number" />
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
                      setDeleteImages={setDeleteImages}
                      folder="product"
                      files={files}
                      setFiles={setFiles}
                      type="images"
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
              {form.getValues("isFeatured") && (
                <ProductFormImageInput
                  noMultiple
                  folder="banner"
                  files={banners}
                  setFiles={setBanners}
                  setDeleteImages={setDeleteBanner}
                  width={1920}
                  height={562}
                  type="banner"
                />
              )}
            </CardContent>
          </Card>
        </div>
        {/* description */}
        <FormInput
          type="textarea"
          placeholder="Enter Product Description"
          name="description"
        />
        {/* buttons */}
        <div className="flex gap-2">
          {/* submit */}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Submitting"
              : `${capitalize(type)} Product`}
          </Button>
          {deleteButton}
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
