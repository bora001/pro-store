"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggleItem from "./theme-toggle-item";
import { SYSTEM_TYPE } from "@/lib/constants";
import { useTheme } from "next-themes";

export const themeIcons = {
  [SYSTEM_TYPE.SYSTEM]: <SunMoon />,
  [SYSTEM_TYPE.DARK]: <MoonIcon />,
  [SYSTEM_TYPE.LIGHT]: <SunIcon />,
};

const ThemeToggle = () => {
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      {/* trigger */}
      <DropdownMenuTrigger asChild role="button">
        <Button variant="ghost" aria-label="theme-toggle">
          {themeIcons[theme || "system"]}
        </Button>
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeToggleItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
