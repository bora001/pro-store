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
    <>
      {!data.length ? (
        <div className="h-80 overflow-y-hidden">
          <Image
            width={1280}
            height={854}
            src="/images/sunflower-8881536_1280.jpg"
            alt="default banner"
          />
        </div>
      ) : (
        <Carousel
          className={cn("w-full mb-12", !data.length && "hidden")}
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={() => isAutoplayEnabled && plugin.current.stop()}
          onMouseLeave={() => isAutoplayEnabled && plugin.current.play()}
        >
          <CarouselContent>
            {data.map(({ id, slug, banner, name }) => (
              <CarouselItem key={id}>
                <Link href={`/product/${slug}`}>
                  <div className="relative mx-auto">
                    <Image
                      src={banner!}
                      height={0}
                      width={0}
                      alt={`${name} banner`}
                      className="w-full h-auto"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 flex items-end justify-center"></div>
                  </div>
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
    </>
  );
};

export default ProductCarousel;
