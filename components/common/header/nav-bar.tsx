"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavBarType = { title: string; href: string }[];
const NavBar = ({ navList }: { navList: NavBarType }) => {
  const pathname = usePathname();

  return (
    <>
      {navList.map(({ title, href }) => (
        <Link key={title} href={href}>
          <Button
            variant="ghost"
            className={
              pathname.includes(href)
                ? "text-black font-semibold"
                : "text-gray-400"
            }
          >
            {title}
          </Button>
        </Link>
      ))}
    </>
  );
};

export default NavBar;
