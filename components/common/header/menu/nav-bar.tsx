"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type NavBarType = { title: string; href: string }[];
const NavBar = ({ navList }: { navList: NavBarType }) => {
  const pathname = usePathname();
  const router = useRouter();

  const moveLink = (link: string) => {
    router.push(link);
  };

  return (
    <div>
      <div className="hidden md:block">
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
      </div>
      <div className="block md:hidden">
        <Select onValueChange={moveLink} defaultValue={pathname}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {navList.map(({ title, href }) => (
                <SelectItem value={href} key={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NavBar;
