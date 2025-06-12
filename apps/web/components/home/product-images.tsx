"use client";
import { useState } from "react";
import Flex from "../common/flex";
import { cn } from "@/lib/utils";
import S3Image from "../common/S3Image";

const PRODUCT_IMAGE_SIZE = 1000;

const ProductImages = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  return (
    <div className="space-y-4">
      <S3Image
        folder="product"
        fileName={images[currentImgIdx]}
        alt={name}
        size={PRODUCT_IMAGE_SIZE}
        priority
      />
      <Flex>
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImgIdx(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              currentImgIdx === index && "border-orange-500"
            )}
          >
            <S3Image
              folder="product"
              fileName={image}
              alt={`${name}_image_${index}`}
              size={PRODUCT_IMAGE_SIZE / 10}
            />
          </div>
        ))}
      </Flex>
    </div>
  );
};

export default ProductImages;
