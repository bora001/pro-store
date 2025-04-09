"use client";
import { ProductItemType } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import S3Image from "../common/S3Image";

const BANNER_SIZE = {
  width: 1920,
  height: 562,
};

const ProductCarousel = ({ data }: { data: ProductItemType[] }) => {
  const isAutoplayEnabled = data.length > 1;
  const plugin = useRef(
    Autoplay({
      active: isAutoplayEnabled,
      delay: 2500,
      playOnInit: true,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );
  return (
    <div>
      {!data.length ? (
        <div className="h-80 overflow-y-hidden">
          <Image
            width={BANNER_SIZE.width}
            height={BANNER_SIZE.height}
            src="/images/sunflower-8881536_1280.jpg"
            alt="default banner"
          />
        </div>
      ) : (
        <Carousel
          className={cn("w-full mb-2", !data.length && "hidden")}
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={() => isAutoplayEnabled && plugin.current.stop()}
          onMouseLeave={() => isAutoplayEnabled && plugin.current.play()}
        >
          <CarouselContent>
            {data.map(({ id, slug, banner, name }) => (
              <CarouselItem key={id}>
                <Link href={`/product/${slug}`}>
                  <S3Image
                    folder="banner"
                    fileName={banner!}
                    width={BANNER_SIZE.width}
                    height={BANNER_SIZE.height}
                    alt={`${name} banner`}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {isAutoplayEnabled && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default ProductCarousel;
