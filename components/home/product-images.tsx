"use client";
import Image from "next/image";
import { useState } from "react";
import Flex from "../common/flex";
import { cn } from "@/lib/utils";

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
      <Image
        src={images[currentImgIdx]}
        alt={`${name}_image`}
        width={1000}
        height={1000}
        className="min-h-[300px]"
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
            <Image
              src={image}
              alt={`${name}_image_${index}`}
              width={100}
              height={100}
            />
          </div>
        ))}
      </Flex>
    </div>
  );
};

export default ProductImages;
