"use client";

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/components/course/progress-provider";

export function ProgressSummary({ lectureIds, labIds }: { lectureIds: string[]; labIds: string[] }) {
  const { completedLectures, completedLabs, hydrated } = useProgress();
  const completed =
    completedLectures.filter((id) => lectureIds.includes(id)).length +
    completedLabs.filter((id) => labIds.includes(id)).length;
  const total = lectureIds.length + labIds.length;
  const value = total ? Math.round((completed / total) * 100) : 0;

  if (!hydrated) {
    return (
      <div className="space-y-3" aria-label="Загрузка прогресса" aria-busy="true">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-1 w-full rounded-full" />
      </div>
    );
  }

  return (
    <Progress value={value} aria-label={`Пройдено ${value}% курса`}>
      <>
        <ProgressLabel>Общий прогресс</ProgressLabel>
        <ProgressValue>{() => `${value}%`}</ProgressValue>
        <p className="w-full text-xs text-muted-foreground">
          {completed} из {total} материалов завершено
        </p>
      </>
    </Progress>
  );
}
