"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export type NavBarType = { title: string; href: string }[];

const PcNavBar = ({ navList }: { navList: NavBarType }) => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block">
      {navList.map(({ title, href }) => (
        <Link key={title} href={href}>
          <Button variant="ghost" className={pathname.includes(href) ? "text-black font-semibold" : "text-gray-400"}>
            {title}
          </Button>
        </Link>
      ))}
    </div>
  );
};

const MobileNavBar = ({ navList }: { navList: NavBarType }) => {
  const router = useRouter();
  const pathname = usePathname();
  const moveLink = (link: string) => {
    router.push(link);
  };
  const defaultValue = useMemo(() => navList.find((item) => pathname.includes(item.href))?.href, [navList, pathname]);
  return (
    <div className="block lg:hidden">
      <Select onValueChange={moveLink} defaultValue={defaultValue}>
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
  );
};

const NavBar = ({ navList }: { navList: NavBarType }) => {
  return (
    <>
      <PcNavBar navList={navList} />
      <MobileNavBar navList={navList} />
    </>
  );
};

export default NavBar;
