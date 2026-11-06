import "server-only";

import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  Heading,
  Material,
  MaterialKind,
  MaterialSummary,
  SearchEntry,
} from "@/lib/course-types";

const contentRoot = path.join(process.cwd(), "content");

function stripInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function createSlugger() {
  const seen = new Map<string, number>();

  return (value: string) => {
    const base = stripInlineMarkdown(value)
      .toLocaleLowerCase("ru")
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/[\s_-]+/g, "-") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function extractHeadings(markdown: string): Heading[] {
  const slug = createSlugger();
  const headings: Heading[] = [];
  let fenced = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;
    const text = stripInlineMarkdown(match[2]);
    headings.push({ level: match[1].length, text, id: slug(text) });
  }

  return headings;
}

function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstUsefulParagraph(markdown: string) {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  const blocks = withoutCode.split(/\n\s*\n/);
  const candidate = blocks.find((block) => {
    const value = block.trim();
    return value && !value.startsWith("#") && !/^(?:[-*]|\d+\.)\s/.test(value);
  });
  return candidate ? plainText(candidate).slice(0, 220) : "Материал курса React.";
}

function fileInfo(fileName: string, kind: MaterialKind) {
  const base = fileName.replace(/\.md$/, "");
  const number = Number.parseInt(base.match(/^\d+/)?.[0] ?? "0", 10);
  const slug = kind === "lecture" ? base.replace(/^\d+-?/, "") : base;
  return { base, number, slug };
}

const readMaterials = cache(async (kind: MaterialKind): Promise<Material[]> => {
  const directory = path.join(contentRoot, kind === "lecture" ? "lectures" : "labs");
  let files: string[] = [];
  try {
    files = (await fs.readdir(directory)).filter((name) => /^\d.*\.md$/.test(name));
  } catch {
    return [];
  }

  const materials = await Promise.all(
    files.map(async (fileName) => {
      const markdown = await fs.readFile(path.join(directory, fileName), "utf8");
      const headings = extractHeadings(markdown);
      const info = fileInfo(fileName, kind);
      const title = headings.find((heading) => heading.level === 1)?.text ?? info.base;
      const href = kind === "lecture" ? `/lectures/${info.slug}` : `/labs/${info.slug}`;

      return {
        id: `${kind}:${info.base}`,
        kind,
        number: info.number,
        slug: info.slug,
        title,
        description: firstUsefulParagraph(markdown),
        href,
        markdown,
        headings,
      } satisfies Material;
    }),
  );

  return materials.sort((a, b) => a.number - b.number || a.title.localeCompare(b.title, "ru"));
});

export async function getLectures() {
  return readMaterials("lecture");
}

export async function getLabs() {
  return readMaterials("lab");
}

export async function getAllMaterials() {
  const [lectures, labs] = await Promise.all([getLectures(), getLabs()]);
  return { lectures, labs };
}

export async function getMaterial(kind: MaterialKind, slug: string) {
  const materials = await readMaterials(kind);
  return materials.find((material) => material.slug === slug) ?? null;
}

export async function getCourseOverview() {
  const markdown = await fs.readFile(path.join(contentRoot, "README.md"), "utf8");
  const title = extractHeadings(markdown).find((heading) => heading.level === 1)?.text ?? "Курс React";
  const intro = markdown
    .split("## Лекции")[0]
    .replace(/^#.*$/m, "")
    .split(/\n\s*\n/)
    .map((block) => plainText(block))
    .filter(Boolean);
  return { title, intro };
}

export async function getMaterialSummaries() {
  const { lectures, labs } = await getAllMaterials();
  const toSummary = (material: Material): MaterialSummary => ({
    id: material.id,
    kind: material.kind,
    number: material.number,
    slug: material.slug,
    title: material.title,
    description: material.description,
    href: material.kind === "lab" ? "/labs" : material.href,
  });
  return {
    lectures: lectures.map(toSummary),
    labs: labs.map(toSummary),
  } satisfies { lectures: MaterialSummary[]; labs: MaterialSummary[] };
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
  const { lectures, labs } = await getAllMaterials();
  const entries: SearchEntry[] = [];

  for (const material of [...lectures, ...labs]) {
    entries.push({
      id: material.id,
      kind: material.kind,
      title: material.title,
      excerpt: plainText(material.markdown).slice(0, 900),
      href: material.kind === "lab" ? "/labs" : material.href,
    });

    const sections = material.markdown.split(/(?=^#{2,3}\s+)/gm).slice(1);
    for (const section of sections) {
      const headingLine = section.split("\n", 1)[0];
      const heading = material.headings.find(
        (item) => item.level > 1 && item.text === stripInlineMarkdown(headingLine.replace(/^#{2,3}\s+/, "")),
      );
      if (!heading) continue;
      entries.push({
        id: `${material.id}:${heading.id}`,
        kind: material.kind,
        title: material.title,
        section: heading.text,
        excerpt: plainText(section.replace(/^#{2,3}.*$/m, "")).slice(0, 500),
        href: material.kind === "lab" ? "/labs" : `${material.href}#${heading.id}`,
      });
    }
  }

  return entries;
}
