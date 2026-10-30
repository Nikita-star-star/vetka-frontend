export type MaterialKind = "lecture" | "lab";

export type Heading = {
  level: number;
  text: string;
  id: string;
};

export type MaterialSummary = {
  id: string;
  kind: MaterialKind;
  number: number;
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type Material = MaterialSummary & {
  markdown: string;
  headings: Heading[];
};

export type SearchEntry = {
  id: string;
  kind: MaterialKind;
  title: string;
  section?: string;
  excerpt: string;
  href: string;
};
