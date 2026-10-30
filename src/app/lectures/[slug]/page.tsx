import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { CourseShell } from "@/components/layout/course-shell";
import { LastLecture } from "@/components/course/last-lecture";
import { MaterialPagination } from "@/components/course/material-pagination";
import { MaterialToggle } from "@/components/course/material-toggle";
import { MarkdownArticle } from "@/components/markdown/markdown-article";
import { getLectures, getMaterial, getMaterialSummaries } from "@/lib/course";

export async function generateStaticParams() {
  return (await getLectures()).map((lecture) => ({ slug: lecture.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterial("lecture", slug);
  return material ? { title: `${material.title} — курс React`, description: material.description } : {};
}

export default async function LecturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [material, summaries] = await Promise.all([getMaterial("lecture", slug), getMaterialSummaries()]);
  if (!material) notFound();
  const index = summaries.lectures.findIndex((lecture) => lecture.id === material.id);

  return (
    <CourseShell lectures={summaries.lectures} labs={summaries.labs} headings={material.headings}>
      <LastLecture href={material.href} />
      <div id="main-content" className="mx-auto max-w-[70ch]">
        <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><BookOpen className="size-4" /> Лекция {String(material.number).padStart(2, "0")}</p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{material.title}</h1>
        <div className="mt-10"><MarkdownArticle markdown={material.markdown} kind="lecture" /></div>
        <div className="mt-10"><MaterialToggle id={material.id} kind="lecture" /></div>
        <MaterialPagination previous={summaries.lectures[index - 1]} next={summaries.lectures[index + 1]} />
      </div>
    </CourseShell>
  );
}
