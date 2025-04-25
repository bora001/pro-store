import Link from "next/link";
import LogoImage from "../logo";
import Menu from "./menu/menu";
import { CONFIG } from "@/lib/constants/config";
import { CONSTANTS, PATH } from "@/lib/constants";
import NavBar, { NavBarType } from "./menu/nav-bar";
import SearchInput from "../search-input";
import CategoryDrawer from "./menu/category-drawer";

const Header = ({
  navList,
  isAdmin,
}: {
  navList?: NavBarType;
  isAdmin?: boolean;
}) => {
  return (
    <header
      style={{
        height: `${CONSTANTS.HEADER_HEIGHT}px`,
      }}
      className={`w-full border-b fixed z-50 bg-white/85 backdrop-blur dark:bg-black/85 dark:border-gray-800`}
    >
      <div className="wrapper flex-between">
        {/* left */}
        <div className="flex-start gap-3">
          <CategoryDrawer />
          <Link href={PATH.HOME} className="flex-start">
            <LogoImage />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {CONFIG.APP_NAME}
            </span>
          </Link>
          {navList && <NavBar navList={navList} />}
        </div>
        {!isAdmin && <SearchInput path={PATH.SEARCH} />}
        {/* right */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
