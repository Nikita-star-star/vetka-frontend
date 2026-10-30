"use client";

import { usePathname } from "next/navigation";
import { CourseNavigation } from "@/components/navigation/course-navigation";
import { useFocusMode } from "@/components/providers";
import type { MaterialSummary } from "@/lib/course-types";
import { cn } from "@/lib/utils";

export function PersistentCourseFrame({
  lectures,
  labs,
  children,
}: {
  lectures: MaterialSummary[];
  labs: MaterialSummary[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { focusMode } = useFocusMode();
  const isCoursePage = pathname.startsWith("/lectures") || pathname.startsWith("/labs");

  if (!isCoursePage) return children;

  return (
    <div
      className={cn(
        "persistent-course-frame mx-auto grid max-w-[1920px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]",
        focusMode && "has-focus-mode",
      )}
    >
      <aside className="course-sidebar course-sidebar-left sticky top-14 hidden h-[calc(100vh-3.5rem)] lg:block">
        <CourseNavigation lectures={lectures} labs={labs} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
