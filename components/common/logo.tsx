import { CONFIG } from "@/lib/constants/config";
import Image from "next/image";

const LogoImage = ({ size = 48 }: { size?: number }) => {
  return (
    <Image
      src="/images/logo.svg"
      alt={`${CONFIG.APP_NAME} logo`}
      height={size}
      width={size}
      priority={true}
    />
  );
};

export default LogoImage;
