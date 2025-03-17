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
import { toTitleCase } from "@/utils/to-title-case";
import { useEffect, useState } from "react";

const SYSTEM_TYPE = {
  SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};
const ThemeToggle = () => {
  const [systemTheme, setSystemTheme] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) setSystemTheme(theme);
  }, [theme]);

  const ThemeToggleCheckboxItem = ({ type }: { type: string }) => (
    <DropdownMenuCheckboxItem
      checked={systemTheme === type}
      onClick={() => setTheme(type)}
    >
      {toTitleCase(type)}
    </DropdownMenuCheckboxItem>
  );

  return (
    <DropdownMenu>
      {/* trigger */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {systemTheme === null && <SunMoon />}
          {systemTheme === SYSTEM_TYPE.SYSTEM && <SunMoon />}
          {systemTheme === SYSTEM_TYPE.DARK && <MoonIcon />}
          {systemTheme === SYSTEM_TYPE.LIGHT && <SunIcon />}
        </Button>
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SYSTEM_TYPE && (
          <>
            <ThemeToggleCheckboxItem type={SYSTEM_TYPE.SYSTEM} />
            <ThemeToggleCheckboxItem type={SYSTEM_TYPE.DARK} />
            <ThemeToggleCheckboxItem type={SYSTEM_TYPE.LIGHT} />
            <DropdownMenuCheckboxItem></DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
