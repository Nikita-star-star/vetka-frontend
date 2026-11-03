import Link from "next/link";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/markdown/code-block";
import { SearchHighlight } from "@/components/markdown/search-highlight";
import { createSlugger } from "@/lib/course";
import type { MaterialKind } from "@/lib/course-types";

function nodeText(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(nodeText).join("");
  if (value && typeof value === "object" && "props" in value) {
    return nodeText((value as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return "";
}

function internalHref(href: string, kind: MaterialKind) {
  if (/^(?:https?:|mailto:|#)/.test(href)) return href;
  const clean = href.replace(/\.md(?=#|$)/, "");
  const [filePath, hash] = clean.split("#");
  const parts = filePath.split("/");
  const file = parts.at(-1) ?? "";
  const targetKind = filePath.includes("labs/") || (kind === "lab" && !filePath.includes("lectures/")) ? "labs" : "lectures";
  const slug = targetKind === "lectures" ? file.replace(/^\d+-?/, "") : file;
  return `/${targetKind}/${slug}${hash ? `#${hash}` : ""}`;
}

export function MarkdownArticle({ markdown, kind }: { markdown: string; kind: MaterialKind }) {
  const slug = createSlugger();

  const heading = (level: 2 | 3 | 4) => {
    function Heading({ children }: { children?: React.ReactNode }) {
      const text = nodeText(children);
      const id = slug(text);
      const Tag = `h${level}` as const;
      return (
        <Tag id={id}>
          <a href={`#${id}`} aria-label={`Ссылка на раздел «${text}»`} className="no-underline">
            {children}
          </a>
        </Tag>
      );
    }
    return Heading;
  };

  return (
    <article data-search-content className="typeset typeset-chat w-full max-w-[70ch]">
      <Suspense fallback={null}>
        <SearchHighlight />
      </Suspense>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: () => null,
          h2: heading(2),
          h3: heading(3),
          h4: heading(4),
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const language = /language-([^\s]+)/.exec(className ?? "")?.[1];
            const code = String(children).replace(/\n$/, "");
            if (language || String(children).includes("\n")) return <CodeBlock code={code} language={language} />;
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="not-typeset my-6 overflow-x-auto rounded-lg border" data-not-typeset>
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b bg-muted/60 px-4 py-2.5 font-medium">{children}</th>,
          td: ({ children }) => <td className="border-b px-4 py-2.5 align-top last:border-b-0">{children}</td>,
          a: ({ href = "", children }) => {
            const external = /^https?:/.test(href);
            if (external) {
              return (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}<span className="sr-only"> (открывается в новой вкладке)</span><ExternalLink className="ml-1 inline size-3" aria-hidden="true" />
                </a>
              );
            }
            return <Link href={internalHref(href, kind)}>{children}</Link>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
