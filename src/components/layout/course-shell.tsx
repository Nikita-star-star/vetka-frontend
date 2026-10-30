import { CourseNavigation } from "@/components/navigation/course-navigation";
import { TableOfContents } from "@/components/navigation/table-of-contents";
import type { Heading, MaterialSummary } from "@/lib/course-types";

export function CourseShell({
  lectures,
  labs,
  headings,
  children,
}: {
  lectures: MaterialSummary[];
  labs: MaterialSummary[];
  headings: Heading[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[1920px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_15rem]">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] border-r lg:block">
        <CourseNavigation lectures={lectures} labs={labs} />
      </aside>
      <main className="min-w-0 overflow-x-hidden px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">{children}</main>
      <aside className="hidden border-l py-6 xl:block">
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}
