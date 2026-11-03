"use client";

import { TableOfContents } from "@/components/navigation/table-of-contents";
import { useFocusMode } from "@/components/providers";
import type { Heading } from "@/lib/course-types";
import { cn } from "@/lib/utils";

export function CourseShell({
  headings,
  children,
}: {
  headings: Heading[];
  children: React.ReactNode;
}) {
  const { focusMode } = useFocusMode();

  return (
    <div className={cn("course-shell mx-auto grid max-w-[1920px] grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_15rem]", focusMode && "has-focus-mode")}>
      <main className="min-w-0 overflow-x-hidden px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">{children}</main>
      <aside
        className="course-sidebar course-sidebar-right hidden py-6 xl:block"
        aria-hidden={focusMode || undefined}
        inert={focusMode}
      >
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}
