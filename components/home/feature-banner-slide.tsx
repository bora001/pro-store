"use client";
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
import { BannerType } from "@/types";

const BANNER_SIZE = {
  width: 1920,
  height: 562,
};

const FeatureBannerSlide = ({ data }: { data: BannerType[] }) => {
  const isAutoplayEnabled = data && data.length > 1;
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
    <div className="w-full">
      {!data.length ? (
        <div className="h-80 overflow-y-hidden">
          <Image
            width={BANNER_SIZE.width}
            height={BANNER_SIZE.height}
            src="/images/sunflower-8881536_1280.jpg"
            alt="default banner"
            priority
          />
        </div>
      ) : (
        <Carousel
          className={cn("mb-2", !data.length && "hidden")}
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={() => isAutoplayEnabled && plugin.current.stop()}
          onMouseLeave={() => isAutoplayEnabled && plugin.current.play()}
        >
          <CarouselContent>
            {data.map(({ id, slug, banner }) => (
              <CarouselItem key={id}>
                <Link href={`/product/${slug}`}>
                  <S3Image
                    folder="banner"
                    fileName={banner!}
                    width={BANNER_SIZE.width}
                    height={BANNER_SIZE.height}
                    alt={`${slug} banner`}
                    priority
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {isAutoplayEnabled && (
            <>
              <CarouselPrevious className="sm:hidden md:flex md:-left-4 shadow-lg" />
              <CarouselNext className="sm:hidden md:flex md:-right-4 shadow-lg" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default FeatureBannerSlide;
