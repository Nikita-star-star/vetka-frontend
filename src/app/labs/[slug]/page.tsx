import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseShell } from "@/components/layout/course-shell";
import { MaterialPagination } from "@/components/course/material-pagination";
import { MaterialToggle } from "@/components/course/material-toggle";
import { MarkdownArticle } from "@/components/markdown/markdown-article";
import { getLabs, getMaterial, getMaterialSummaries } from "@/lib/course";

export async function generateStaticParams() {
  return (await getLabs()).map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterial("lab", slug);
  return material ? { title: `${material.title} — курс React`, description: material.description } : {};
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [material, summaries] = await Promise.all([getMaterial("lab", slug), getMaterialSummaries()]);
  if (!material) notFound();
  const index = summaries.labs.findIndex((lab) => lab.id === material.id);

  return (
    <CourseShell headings={material.headings}>
      <div id="main-content" className="mx-auto max-w-[70ch]">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{material.title}</h1>
        <div className="mt-10"><MarkdownArticle markdown={material.markdown} kind="lab" /></div>
        <div className="mt-10"><MaterialToggle id={material.id} kind="lab" /></div>
        <MaterialPagination previous={summaries.labs[index - 1]} next={summaries.labs[index + 1]} />
      </div>
    </CourseShell>
  );
}
