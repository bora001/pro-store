import Link from "next/link";
import LogoImage from "../logo";
import Menu from "./menu";
import { CONFIG } from "@/lib/constants/config";
import { PATH } from "@/lib/constants";
import NavBar, { NavBarType } from "./nav-bar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = ({ navList }: { navList?: NavBarType }) => {
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
        <div className={cn("flex gap-2", navList ? "" : "")}>
          <Input placeholder="Search" />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        {/* right */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
