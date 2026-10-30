"use client";

import Link from "next/link";
import { ArrowUpRight, CircleCheck } from "lucide";
import { MorphIcon } from "morphicons/react";
import { useProgress } from "@/components/course/progress-provider";
import type { MaterialSummary } from "@/lib/course-types";
import { cn } from "@/lib/utils";

export function HomeMaterialList({ materials }: { materials: MaterialSummary[] }) {
  const { hydrated, isComplete } = useProgress();
  return (
    <ol className="divide-y border-y">
      {materials.map((material) => {
        const complete = hydrated && isComplete(material.kind, material.id);
        return (
          <li key={material.id}>
            <Link href={material.href} className="group flex min-h-14 items-center gap-3 py-3 text-sm transition-[background-color,color] duration-300 ease-out hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {String(material.number).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 font-medium">{material.title}</span>
              <MorphIcon
                icon={complete ? CircleCheck : ArrowUpRight}
                className={cn("size-4 shrink-0 transition-colors", complete ? "text-primary" : "text-muted-foreground")}
                spring="smooth"
                reducedMotion="user"
              />
              <span className={cn("text-xs text-muted-foreground transition-opacity duration-300", complete ? "opacity-100" : "opacity-0")} aria-hidden={!complete}>
                Завершено
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
