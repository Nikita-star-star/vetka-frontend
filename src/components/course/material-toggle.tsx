"use client";

import { Check, RotateCcw } from "lucide";
import { MorphIcon } from "morphicons/react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/course/progress-provider";
import type { MaterialKind } from "@/lib/course-types";

export function MaterialToggle({ id, kind }: { id: string; kind: MaterialKind }) {
  const { hydrated, isComplete, toggleComplete } = useProgress();
  const complete = isComplete(kind, id);

  return (
    <Button
      variant={complete ? "outline" : "default"}
      size="lg"
      className="h-11 w-full text-base sm:h-9 sm:w-auto sm:text-sm"
      disabled={!hydrated}
      onClick={() => toggleComplete(kind, id)}
      aria-pressed={complete}
    >
      <MorphIcon
        icon={complete ? RotateCcw : Check}
        className="size-4"
        spring="smooth"
        reducedMotion="user"
        aria-hidden="true"
      />
      <span aria-live="polite">
        {complete
          ? kind === "lecture"
            ? "Отменить завершение"
            : "Отменить выполнение"
          : kind === "lecture"
            ? "Завершить лекцию"
            : "Отметить выполненной"}
      </span>
    </Button>
  );
}
