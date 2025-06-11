"use client";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Image, { ImageProps } from "next/image";
import { CONFIG } from "@/lib/constants/config";

type BaseS3ImageProps = Omit<
  ImageProps,
  "src" | "className" | "width" | "height"
> & {
  fileName: string;
  folder: string;
  className?: ClassValue;
};

interface DimensionProps extends BaseS3ImageProps {
  width: number;
  height: number;
  size?: never;
}

interface SizeProps extends BaseS3ImageProps {
  size: number;
  width?: never;
  height?: never;
}

const S3Image = ({
  fileName,
  folder,
  className,
  width,
  height,
  size,
  ...props
}: DimensionProps | SizeProps) => {
  return (
    <div
      className={cn(`aspect-[${width}/${height}] overflow-y-hidden`, className)}
    >
      <Image
        {...props}
        width={size || width}
        height={size || height}
        src={`https://${CONFIG.IMAGE_URL}/${folder}/${fileName}`}
        alt={fileName}
      />
    </div>
  );
};

export default S3Image;
