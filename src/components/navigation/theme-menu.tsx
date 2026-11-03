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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_ACCENT = "#2563eb";
const ACCENT_STORAGE_KEY = "react-course-accent";
const ACCENT_COLORS = [
  { value: "#2563eb", name: "Синий" },
  { value: "#4338ca", name: "Индиго" },
  { value: "#6d28d9", name: "Фиолетовый" },
  { value: "#a21caf", name: "Пурпурный" },
  { value: "#be185d", name: "Розовый" },
  { value: "#be123c", name: "Малиновый" },
  { value: "#c2410c", name: "Оранжевый" },
  { value: "#047857", name: "Зелёный" },
  { value: "#0f766e", name: "Бирюзовый" },
  { value: "#0e7490", name: "Голубой" },
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
        aria-label="Вернуться к выбору темы"
        className="flex min-h-10 w-full items-center gap-2 rounded-md px-2 py-2 text-base font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:min-h-0 sm:py-1.5 sm:text-sm"
      >
        <ArrowLeft className="size-5 sm:size-4" />
        Акцентный цвет
      </button>
      <p className="px-2 pb-3 pt-3 text-sm text-muted-foreground sm:pb-2 sm:text-xs">Выберите цвет для активных элементов</p>
      <div className="grid grid-cols-5 gap-3 px-2 pb-2 sm:gap-3" role="group" aria-label="Палитра акцентных цветов">
        {ACCENT_COLORS.map(({ value, name }) => {
          const selected = selectedAccent.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={value}
              type="button"
              aria-label={`${name} акцент`}
              aria-pressed={selected}
              onClick={() => onChoose(value)}
              className="group flex size-10 items-center justify-center rounded-full border-2 border-transparent p-0.5 outline-none transition-transform duration-200 hover:scale-110 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:size-9"
            >
              <span className="flex size-full items-center justify-center rounded-full" style={{ backgroundColor: value }}>
                {selected && <Check className="size-4 text-white drop-shadow-sm" aria-hidden="true" />}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function ThemeMenu() {
  const { theme, resolvedTheme, setTheme } = useTheme();
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
    <Button
      variant="ghost"
      size="icon"
      className="size-10 lg:size-8"
      aria-label={`Выбрать тему. Текущая тема: ${theme === "light" ? "светлая" : theme === "dark" ? "тёмная" : "системная"}`}
    >
      <MorphIcon
        icon={resolvedTheme === "dark" ? MoonIcon : SunIcon}
        className="size-5 lg:size-4"
        spring="smooth"
        reducedMotion="user"
        aria-hidden="true"
      />
    </Button>
  );

  return paletteOpen ? (
    <DropdownMenu open onOpenChange={setPaletteOpen}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" aria-label="Настройка акцентного цвета" className="w-[min(90vw,20rem)] p-2 sm:w-60">
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
      <DropdownMenuContent align="end" aria-label="Выбор темы" className="min-w-48 sm:min-w-40">
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="min-h-10 text-base sm:min-h-0 sm:text-sm">
            <Sun className="size-5 sm:size-4" aria-hidden="true" /> Светлая
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="min-h-10 text-base sm:min-h-0 sm:text-sm">
            <Moon className="size-5 sm:size-4" aria-hidden="true" /> Тёмная
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator className="mx-2 w-[calc(100%_-_16px)]" />
          <DropdownMenuRadioItem value="system" className="min-h-10 text-base sm:min-h-0 sm:text-sm">
            <Laptop className="size-5 sm:size-4" aria-hidden="true" /> Системная
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="mx-2 w-[calc(100%_-_16px)]" />
        <DropdownMenuItem className="min-h-10 text-base sm:min-h-0 sm:text-sm" onClick={openPalette}>
          <Palette className="size-5 sm:size-4" aria-hidden="true" /> Кастом
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
