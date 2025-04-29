import Flex from "../../flex";
import { EllipsisVertical } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "../user-button/user-button";
import MobileMenuDrawer from "./mobile-menu-drawer";
import CartIconButton from "../buttons/cart-icon-button";
import ThemeToggle from "../theme-toggle";

const MenuContent = (
  <>
    <ThemeToggle />
    <CartIconButton />
    <UserButton />
  </>
);

const Menu = () => {
  return (
    <Flex>
      <nav className="hidden md:flex w-full max-w-xs gap-1">{MenuContent}</nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetDescription className="sr-only">
            Open the menu to change the browser theme, access the cart page, or
            navigate to the profile page, admin page, order page, or sign
            in/sign out
          </SheetDescription>
          <SheetTrigger
            className="align-middle"
            aria-label="mobile-menu-button"
          >
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start w-[220px] ">
            <SheetTitle>Menu</SheetTitle>
            <div className="block md:hidden">
              <MobileMenuDrawer />
            </div>
            <div className="hidden md:block">{MenuContent}</div>
          </SheetContent>
        </Sheet>
      </nav>
    </Flex>
  );
};

export default Menu;
