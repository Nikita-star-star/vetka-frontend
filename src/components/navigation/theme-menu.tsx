"use client";

import { ArrowLeft, Check, Laptop, Moon, Palette, Sun } from "lucide-react";
import { Moon as MoonIcon, Sun as SunIcon } from "lucide";
import { MorphIcon } from "morphicons/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_ACCENT = "#3b82f6";
const ACCENT_STORAGE_KEY = "react-course-accent";
const ACCENT_COLORS = [
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#c026d3",
  "#db2777",
  "#e11d48",
  "#ea580c",
  "#059669",
  "#0f766e",
  "#0891b2",
];

function applyAccent(color: string) {
  document.documentElement.style.setProperty("--primary", color);
  document.documentElement.style.setProperty("--ring", color);
  document.documentElement.style.setProperty("--sidebar-primary", color);
}

function AccentPalette({
  selectedAccent,
  onBack,
  onChoose,
}: {
  selectedAccent: string;
  onBack: () => void;
  onChoose: (color: string) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" />
        Акцентный цвет
      </button>
      <p className="px-2 pb-2 pt-3 text-xs text-muted-foreground">Выберите цвет для активных элементов</p>
      <div className="grid grid-cols-5 gap-3 px-2 pb-2" aria-label="Палитра акцентных цветов">
        {ACCENT_COLORS.map((color) => {
          const selected = selectedAccent.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              aria-label={`Выбрать цвет ${color}`}
              aria-pressed={selected}
              onClick={() => onChoose(color)}
              className="group flex size-9 items-center justify-center rounded-full border-2 border-transparent p-0.5 outline-none transition-transform duration-200 hover:scale-110 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="flex size-full items-center justify-center rounded-full" style={{ backgroundColor: color }}>
                {selected && <Check className="size-4 text-white drop-shadow-sm" />}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function ThemeMenu() {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    const savedAccent = window.localStorage.getItem(ACCENT_STORAGE_KEY);
    if (!savedAccent) return;
    applyAccent(savedAccent);
    window.setTimeout(() => setSelectedAccent(savedAccent), 0);
  }, []);

  const chooseAccent = (color: string) => {
    applyAccent(color);
    setSelectedAccent(color);
    window.localStorage.setItem(ACCENT_STORAGE_KEY, color);
  };

  const openPalette = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => setPaletteOpen(true), 140);
  };

  const returnToThemeMenu = () => {
    setPaletteOpen(false);
    window.setTimeout(() => setMenuOpen(true), 140);
  };

  const trigger = (
    <Button variant="ghost" size="icon" aria-label="Выбрать тему">
      <MorphIcon
        icon={resolvedTheme === "dark" ? MoonIcon : SunIcon}
        className="size-4"
        spring="smooth"
        reducedMotion="user"
      />
    </Button>
  );

  return paletteOpen ? (
    <DropdownMenu open onOpenChange={setPaletteOpen}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" className="w-60 p-2">
        <AccentPalette
          selectedAccent={selectedAccent}
          onBack={returnToThemeMenu}
          onChoose={chooseAccent}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun /> Светлая
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon /> Тёмная
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx-2 w-[calc(100%_-_16px)]" />
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop /> Системная
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx-2 w-[calc(100%_-_16px)]" />
        <DropdownMenuItem onClick={openPalette}>
          <Palette /> Кастом
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
