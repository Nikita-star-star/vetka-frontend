"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleCheck, FlaskConical } from "lucide-react";
import { useProgress } from "@/components/course/progress-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { MaterialSummary } from "@/lib/course-types";

export function CourseNavigation({
  lectures,
  labs,
  onNavigate,
  className,
}: {
  lectures: MaterialSummary[];
  labs: MaterialSummary[];
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const navigationRef = useRef<HTMLDivElement>(null);
  const { hydrated, isComplete } = useProgress();

  useEffect(() => {
    const navigation = navigationRef.current;
    const viewport = navigation?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    if (!navigation || !viewport) return;

    const storageKey = "react-course-navigation-scroll";
    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const shouldFocusActive = navigationEntry?.type === "reload";

    const restoreScroll = () => {
      if (shouldFocusActive) {
        navigation.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
        return;
      }

      const savedScroll = window.sessionStorage.getItem(storageKey);
      if (savedScroll) viewport.scrollTop = Number(savedScroll);
    };

    const saveScroll = () => {
      window.sessionStorage.setItem(storageKey, String(viewport.scrollTop));
    };

    restoreScroll();
    const frame = window.requestAnimationFrame(restoreScroll);
    viewport.addEventListener("scroll", saveScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener("scroll", saveScroll);
    };
  }, [pathname]);

  return (
    <div ref={navigationRef} className={cn("h-full min-h-0", className)}>
      <ScrollArea className="course-navigation-scroll-area h-full min-h-0">
      <nav aria-label="Материалы курса" className="space-y-6 p-4">
        <div>
          <p className="mb-2 px-2 text-xs font-medium tracking-wider text-muted-foreground">Лекции</p>
          <ol className="space-y-0.5">
            {lectures.map((lecture) => {
              const active = pathname === lecture.href;
              const complete = hydrated && isComplete("lecture", lecture.id);
              return (
                <li key={lecture.id}>
                  <Link
                    href={lecture.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-9 items-start gap-2 rounded-md px-2 py-2 text-sm leading-5 text-muted-foreground transition-[background-color,color] duration-300 ease-out hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "bg-muted font-medium text-foreground",
                    )}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs leading-5 tabular-nums">{String(lecture.number).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">{lecture.title}</span>
                    <CircleCheck className="status-icon mt-0.5 size-4 shrink-0 text-primary" data-complete={complete} aria-hidden="true" />
                    {complete && <span className="sr-only">Завершено</span>}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
        <div>
          <p className="mb-2 px-2 text-xs font-medium tracking-wider text-muted-foreground">Лабораторные работы</p>
          <Link
            href="/labs"
            onClick={onNavigate}
            aria-current={pathname === "/labs" ? "page" : undefined}
            className={cn(
              "mb-1 flex min-h-9 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-[background-color,color] duration-300 ease-out hover:bg-muted hover:text-foreground",
              pathname === "/labs" && "bg-muted font-medium text-foreground",
            )}
          >
            <FlaskConical className="size-4" aria-hidden="true" /> Все лабораторные
          </Link>
          <ol className="space-y-0.5">
            {labs.map((lab) => {
              const active = pathname === lab.href;
              const complete = hydrated && isComplete("lab", lab.id);
              return (
                <li key={lab.id}>
                  <Link
                    href={lab.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-9 items-start gap-2 rounded-md px-2 py-2 text-sm leading-5 text-muted-foreground transition-[background-color,color] duration-300 ease-out hover:bg-muted hover:text-foreground",
                      active && "bg-muted font-medium text-foreground",
                    )}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs leading-5 tabular-nums">Л{lab.number}</span>
                    <span className="min-w-0 flex-1">{lab.title.replace(/^Лабораторная работа №\d+\.\s*/, "")}</span>
                    <CircleCheck className="status-icon mt-0.5 size-4 shrink-0 text-primary" data-complete={complete} aria-hidden="true" />
                    {complete && <span className="sr-only">Выполнено</span>}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
      </ScrollArea>
    </div>
  );
}
