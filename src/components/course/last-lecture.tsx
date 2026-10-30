"use client";

import { useEffect } from "react";
import { useProgress } from "@/components/course/progress-provider";

export function LastLecture({ href }: { href: string }) {
  const { hydrated, setLastLecture } = useProgress();
  useEffect(() => {
    if (hydrated) setLastLecture(href);
  }, [href, hydrated, setLastLecture]);
  return null;
}
