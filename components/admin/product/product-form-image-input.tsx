"use client";
import S3Image from "@/components/common/S3Image";
import IconButton from "@/components/custom/IconButton";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CircleX, Upload } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";

const ProductFormImageInput = ({
  folder,
  images,
  width = 100,
  height = 100,
  noMultiple,
  files,
  setFiles,
}: {
  folder: string;
  images: string[];
  width?: number;
  height?: number;
  noMultiple?: boolean;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) => {
  const hasImages = files.length === 1 || images.length === 1;
  const deleteImage = async (key: string) => {
    console.log(key, "Delete");
  };
  const [previews, setPreviews] = useState<string[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const newFiles = files.concat(selectedFiles);
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setFiles(newFiles);
      setPreviews(previews.concat(newPreviews));
    }
  };
  const deleteFile = (image: string) => {
    setPreviews((prev) => prev.filter((item) => item !== image));
    setFiles((prev) => {
      const indexToRemove = previews.indexOf(image);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={cn("flex-start space-x-2")}>
      {images.map((image) => (
        <div key={String(image)} className="relative">
          <IconButton
            variant="ghost"
            type="button"
            className="p-0 py-0 h-auto absolute right-0"
            onClick={() => deleteImage(image)}
            icon={<CircleX color="red" fill="#fcdede" />}
          />
          <S3Image
            folder={folder}
            fileName={String(image)}
            alt={`${folder} image`}
            width={width}
            height={height}
          />
        </div>
      ))}
      <FormControl>
        <div className="flex gap-2">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {/* File Select Button */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-24 h-24 border rounded-md flex flex-col",
                noMultiple && hasImages && "hidden"
              )}
            >
              <Upload />
              Upload
            </Button>
          </div>
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {/* image-delete-button */}
              <IconButton
                variant="ghost"
                type="button"
                className="p-0 py-0 h-auto absolute right-0"
                onClick={() => deleteFile(preview)}
                icon={<CircleX color="red" fill="#fcdede" />}
              />
              {/* preview-thumbnail */}
              <Image
                src={preview}
                width={width}
                height={height}
                alt={`Preview ${index}`}
              />
            </div>
          ))}
        </div>
      </FormControl>
    </div>
  );
};

export default ProductFormImageInput;
