import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingContent = () => {
  return (
    <div className="flex flex-1 items-center justify-center h-full w-full">
      <div className="w-[55px] h-[55px] relative">
        <Image
          src={loader}
          alt="loading..."
          sizes="100%"
          fill
          style={{
            filter:
              "saturate(100%) invert(40%) sepia(40%) saturate(1300%) hue-rotate(20deg) brightness(100%) contrast(200%)",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingContent;
