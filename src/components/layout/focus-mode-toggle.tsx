"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide";
import { MorphIcon } from "morphicons/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/components/providers";

export function FocusModeToggle() {
  const pathname = usePathname();
  const { focusMode, toggleFocusMode } = useFocusMode();
  const label = focusMode ? "Показать боковые панели" : "Включить режим фокусировки";

  if (pathname === "/") return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hidden lg:inline-flex"
      aria-label={label}
      aria-pressed={focusMode}
      onClick={toggleFocusMode}
    >
      <MorphIcon
        icon={focusMode ? PanelLeftOpen : PanelLeftClose}
        className="size-4"
        spring="smooth"
        reducedMotion="user"
      />
    </Button>
  );
}
