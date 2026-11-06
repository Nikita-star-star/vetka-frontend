import type { Metadata } from "next";
import { Download } from "lucide-react";
import { CourseShell } from "@/components/layout/course-shell";
import { getMaterialSummaries } from "@/lib/course";

export const metadata: Metadata = {
  title: "Лабораторные работы — курс React",
  description: "Три лабораторные работы по React: компоненты, состояние, формы, API и маршрутизация.",
};

export default async function LabsPage() {
  const { labs } = await getMaterialSummaries();
  return (
    <CourseShell headings={[]}>
      <div id="main-content" tabIndex={-1} data-prevent-page-overscroll className="mx-auto max-w-3xl outline-none">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Лабораторные работы</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Скачайте задания трёх последовательных лабораторных работ в формате DOCX и выполняйте их в своей среде разработки.</p>
        <div className="mt-10 space-y-3">
          {labs.map((lab) => (
            <a
              key={lab.id}
              href={`/lab-files/laboratory-${lab.number}.docx`}
              download={`Лабораторная работа №${lab.number}.docx`}
              className="group flex items-start justify-between gap-4 rounded-lg border p-4 transition-[background-color,border-color,box-shadow] hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div>
                <p className="font-medium">
                  Лабораторная работа №{lab.number}. {lab.title.replace(/^Лабораторная работа №\d+\.\s*/, "")}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{lab.description}</p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">Скачать DOCX</p>
              </div>
              <Download className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </CourseShell>
  );
}
