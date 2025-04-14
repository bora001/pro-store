import Image from "next/image";
import loader from "@/assets/loader.gif";
const LoadingContent = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        src={loader}
        alt="loading..."
        width={55}
        height={55}
        style={{
          filter:
            "saturate(100%) invert(40%) sepia(40%) saturate(1300%) hue-rotate(20deg) brightness(100%) contrast(200%)",
        }}
      />
    </div>
  );
};

export default LoadingContent;
