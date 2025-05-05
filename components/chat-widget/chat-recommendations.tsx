import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { TypesenseProductByTag } from "@/lib/typesense/product-by-tag/search-product-by-tag";
import S3Image from "../common/S3Image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PATH } from "@/lib/constants";

const ChatRecommendations = ({ data }: { data: TypesenseProductByTag[] }) => {
  const hasButton = data.length > 2;
  return (
    <div className="w-80 bg-gray-200 py-4 rounded-sm">
      <Carousel
        opts={{
          align: "start",
        }}
        className={cn(
          !data.length && "hidden",
          "flex items-center justify-center"
        )}
      >
        <CarouselContent className={cn(hasButton ? "w-56" : "w-64")}>
          {data.map(({ slug, name, images }) => (
            <CarouselItem
              key={slug}
              className={cn(
                hasButton && "basis-1/2",
                data.length === 2 && "basis-1/2",
                data.length !== 2 &&
                  !hasButton &&
                  "flex items-center justify-center"
              )}
            >
              <Link href={`${PATH.PRODUCT}/${slug}`}>
                <S3Image
                  className="rounded-2xl"
                  folder="product"
                  fileName={images}
                  alt={name}
                  size={110}
                  priority
                />
                <p className="text-xs mt-2 line-clamp-2 max-w-[110px] text-center">
                  {name}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className={hasButton ? "block" : "hidden"}>
          <CarouselPrevious className="shadow-lg left-0" type="button" />
          <CarouselNext className="shadow-lg right-0" type="button" />
        </div>
      </Carousel>
    </div>
  );
};

export default ChatRecommendations;
