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
const ProductCarousel = ({ data }: { data: ProductItemType[] }) => {
  const plugin = useRef(
    Autoplay({
      active: true,
      delay: 2500,
      playOnInit: true,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );
  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;
