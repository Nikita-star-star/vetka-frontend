"use client";

import { Check, RotateCcw } from "lucide-react";
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
      disabled={!hydrated}
      onClick={() => toggleComplete(kind, id)}
      aria-pressed={complete}
    >
      {complete ? <RotateCcw /> : <Check />}
      {complete
        ? kind === "lecture"
          ? "Отменить завершение"
          : "Отменить выполнение"
        : kind === "lecture"
          ? "Завершить лекцию"
          : "Отметить выполненной"}
    </Button>
  );
}
