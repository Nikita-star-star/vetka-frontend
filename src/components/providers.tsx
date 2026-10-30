"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/components/course/progress-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
