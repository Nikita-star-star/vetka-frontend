"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/components/course/progress-provider";

function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

type FocusModeContextValue = {
  focusMode: boolean;
  toggleFocusMode: () => void;
};

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (!context) throw new Error("useFocusMode must be used inside Providers");
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [focusMode, setFocusMode] = useState(false);
  const focusValue = useMemo(
    () => ({ focusMode, toggleFocusMode: () => setFocusMode((current) => !current) }),
    [focusMode],
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <ProgressProvider>
          <FocusModeContext.Provider value={focusValue}>
            <ScrollToTopOnRouteChange />
            {children}
          </FocusModeContext.Provider>
        </ProgressProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
