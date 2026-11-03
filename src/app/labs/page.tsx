import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseShell } from "@/components/layout/course-shell";
import { ProgressSummary } from "@/components/course/progress-summary";
import { getMaterialSummaries } from "@/lib/course";

export const metadata: Metadata = {
  title: "Лабораторные работы — курс React",
  description: "Три лабораторные работы по React: компоненты, состояние, формы, API и маршрутизация.",
};

export default async function LabsPage() {
  const { lectures, labs } = await getMaterialSummaries();
  return (
    <CourseShell headings={[]}>
      <div id="main-content" className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Лабораторные работы</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Закрепите материал в трёх последовательных проектах. Выполняйте их в своей среде разработки и отмечайте готовность вручную.</p>
        <div className="mt-8 rounded-xl border bg-muted/25 p-5">
          <ProgressSummary lectureIds={lectures.map((item) => item.id)} labIds={labs.map((item) => item.id)} />
        </div>
        <div className="mt-10 space-y-3">
          {labs.map((lab) => (
            <Link key={lab.id} href={lab.href} className="group flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div>
                <p className="font-medium">
                  Лабораторная работа №{lab.number}. {lab.title.replace(/^Лабораторная работа №\d+\.\s*/, "")}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{lab.description}</p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </CourseShell>
  );
}
