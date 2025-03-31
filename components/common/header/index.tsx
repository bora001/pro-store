import Link from "next/link";
import LogoImage from "../logo";
import Menu from "./menu";
import { CONFIG } from "@/lib/constants/config";
import { PATH } from "@/lib/constants";
import NavBar, { NavBarType } from "./nav-bar";
import SearchInput from "../search-input";

const Header = ({
  navList,
  isAdmin,
}: {
  navList?: NavBarType;
  isAdmin?: boolean;
}) => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        {/* left */}
        <div className="flex-start space-x-3">
          <Link href={PATH.HOME} className="flex-start">
            <LogoImage />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {CONFIG.APP_NAME}
            </span>
          </Link>
          <div>{navList && <NavBar navList={navList} />}</div>
        </div>
        {!isAdmin && <SearchInput query="" />}
        {/* right */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
