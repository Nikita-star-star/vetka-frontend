"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/components/course/progress-provider";
import { cn } from "@/lib/utils";

export function ContinueButton({ firstLecture }: { firstLecture: string }) {
  const { hydrated, lastLecture } = useProgress();
  if (!hydrated) return <Skeleton className="h-9 w-44 rounded-lg" />;

  return (
    <Link href={lastLecture ?? firstLecture} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
      {lastLecture ? "Продолжить обучение" : "Начать обучение"}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}
