import Link from "next/link";
import LogoImage from "../logo";
import Menu from "./menu";
import { CONFIG } from "@/lib/constants/config";
import { CONSTANTS, PATH } from "@/lib/constants";
import NavBar, { NavBarType } from "./nav-bar";
import SearchInput from "../search-input";
import CategoryDrawer from "./category-drawer";

const Header = ({
  navList,
  isAdmin,
}: {
  navList?: NavBarType;
  isAdmin?: boolean;
}) => {
  return (
    <header
      className={`w-full border-b h-[${CONSTANTS.HEADER_HEIGHT}] fixed z-50 bg-white/85 backdrop-blur dark:bg-black/85 dark:border-gray-800`}
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
          <div>{navList && <NavBar navList={navList} />}</div>
        </div>
        {!isAdmin && <SearchInput path={PATH.SEARCH} />}
        {/* right */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
