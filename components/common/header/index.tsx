import Link from "next/link";
import LogoImage from "../logo";
import Menu from "./menu";
import { CONFIG } from "@/lib/constants/config";
import { PATH } from "@/lib/constants";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        {/* left */}
        <div className="flex-start">
          <Link href={PATH.HOME} className="flex-start">
            <LogoImage />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {CONFIG.APP_NAME}
            </span>
          </Link>
        </div>
        {/* right */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
