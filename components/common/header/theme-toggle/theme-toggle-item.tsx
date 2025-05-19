"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { SYSTEM_TYPE } from "@/lib/constants";
import { capitalize } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { themeIcons } from ".";

const THEME_LIST = [SYSTEM_TYPE.SYSTEM, SYSTEM_TYPE.DARK, SYSTEM_TYPE.LIGHT];

const ThemeToggleItem = ({ noPopup = false }: { noPopup?: boolean }) => {
  const [systemTheme, setSystemTheme] = useState<string>(SYSTEM_TYPE.SYSTEM);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) setSystemTheme(theme);
  }, [setSystemTheme, theme]);

  return (
    <>
      {SYSTEM_TYPE &&
        THEME_LIST.map((theme) =>
          noPopup ? (
            <Button variant="ghost" key={theme} onClick={() => setTheme(theme)} className="flex justify-between gap-7">
              {capitalize(theme)}
              {themeIcons[theme]}
            </Button>
          ) : (
            <DropdownMenuCheckboxItem key={theme} checked={systemTheme === theme} onClick={() => setTheme(theme)}>
              {capitalize(theme)}
            </DropdownMenuCheckboxItem>
          )
        )}
    </>
  );
};

export default ThemeToggleItem;
