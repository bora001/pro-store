import { Button } from "@/components/ui/button";
import Link from "next/link";

export type NavBarType = { title: string; href: string }[];
const NavBar = ({ navList }: { navList: NavBarType }) => {
  return (
    <>
      {navList.map(({ title, href }) => (
        <Link key={title} href={href}>
          <Button variant="ghost">{title}</Button>
        </Link>
      ))}
    </>
  );
};

export default NavBar;
