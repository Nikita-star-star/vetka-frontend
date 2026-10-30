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
  const activeRef = useRef<HTMLAnchorElement>(null);
  const { hydrated, isComplete } = useProgress();

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <nav aria-label="Материалы курса" className="space-y-6 p-4">
        <div>
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Лекции</p>
          <ol className="space-y-0.5">
            {lectures.map((lecture) => {
              const active = pathname === lecture.href;
              const complete = hydrated && isComplete("lecture", lecture.id);
              return (
                <li key={lecture.id}>
                  <Link
                    ref={active ? activeRef : undefined}
                    href={lecture.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-9 items-start gap-2 rounded-md px-2 py-2 text-sm leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active && "bg-muted font-medium text-foreground",
                    )}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs leading-5 tabular-nums">{String(lecture.number).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">{lecture.title}</span>
                    {complete && <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-label="Завершено" />}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
        <div>
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Практика</p>
          <Link
            href="/labs"
            onClick={onNavigate}
            className={cn(
              "mb-1 flex min-h-9 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === "/labs" && "bg-muted font-medium text-foreground",
            )}
          >
            <FlaskConical className="size-4" /> Все лабораторные
          </Link>
          <ol className="space-y-0.5">
            {labs.map((lab) => {
              const active = pathname === lab.href;
              const complete = hydrated && isComplete("lab", lab.id);
              return (
                <li key={lab.id}>
                  <Link
                    ref={active ? activeRef : undefined}
                    href={lab.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-9 items-start gap-2 rounded-md px-2 py-2 text-sm leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      active && "bg-muted font-medium text-foreground",
                    )}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs leading-5 tabular-nums">Л{lab.number}</span>
                    <span className="min-w-0 flex-1">{lab.title.replace(/^Лабораторная работа №\d+\.\s*/, "")}</span>
                    {complete && <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-label="Выполнено" />}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </ScrollArea>
  );
}
