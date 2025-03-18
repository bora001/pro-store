import { CONFIG } from "@/lib/constants/config";
import Image from "next/image";

const LogoImage = ({ size }: { size?: number }) => {
  return (
    <Image
      src="/images/logo.svg"
      alt={`${CONFIG.APP_NAME} logo`}
      height={size || 48}
      width={size || 48}
      priority={true}
    />
  );
};

export default LogoImage;
