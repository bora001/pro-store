"use client";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { PATH } from "@/lib/constants";

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
  const [imageUrl, setImageUrl] = useState<string>("/");
  useEffect(() => {
    async function fetchPresignedUrl() {
      try {
        const res = await fetch(
          `${PATH.API_GET_PRESIGNED_URL}?fileName=${fileName}&folder=${folder}`
        );
        if (!res.ok) throw new Error("Failed to fetch presigned URL");
        const data = await res.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error("이미지 로드 실패:", error);
      }
    }

    fetchPresignedUrl();
  }, [fileName]);

  return (
    <div
      className={cn(`aspect-[${width}/${height}] overflow-y-hidden`, className)}
    >
      <Skeleton className={cn(imageUrl && "animate-none")}>
        <Image
          {...props}
          width={size || width}
          height={size || height}
          src={imageUrl}
          alt={fileName}
        />
      </Skeleton>
    </div>
  );
};

export default S3Image;
