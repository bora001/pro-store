"use client";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { capitalize } from "@/lib/utils";

const SYSTEM_TYPE = {
  SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};
const THEME_LIST = [SYSTEM_TYPE.SYSTEM, SYSTEM_TYPE.DARK, SYSTEM_TYPE.LIGHT];
const themeIcons = {
  [SYSTEM_TYPE.SYSTEM]: <SunMoon />,
  [SYSTEM_TYPE.DARK]: <MoonIcon />,
  [SYSTEM_TYPE.LIGHT]: <SunIcon />,
};

const ThemeToggle = () => {
  const [systemTheme, setSystemTheme] = useState<string>(SYSTEM_TYPE.SYSTEM);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) setSystemTheme(theme);
  }, [theme]);

  const ThemeToggleCheckboxItem = ({ type }: { type: string }) => (
    <DropdownMenuCheckboxItem
      checked={systemTheme === type}
      onClick={() => setTheme(type)}
    >
      {capitalize(type)}
    </DropdownMenuCheckboxItem>
  );

  return (
    <DropdownMenu>
      {/* trigger */}
      <DropdownMenuTrigger asChild role="button">
        <Button variant="ghost" aria-label="theme-toggle">
          {themeIcons[systemTheme]}
        </Button>
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SYSTEM_TYPE &&
          THEME_LIST.map((theme) => (
            <ThemeToggleCheckboxItem key={theme} type={theme} />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
