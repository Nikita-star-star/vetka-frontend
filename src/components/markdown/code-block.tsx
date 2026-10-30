import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { CopyCodeButton } from "@/components/markdown/copy-code-button";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);

const languageNames: Record<string, string> = {
  bash: "Bash",
  sh: "Shell",
  css: "CSS",
  html: "HTML",
  xml: "HTML",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
};

function highlighterLanguage(language: string) {
  if (["js", "jsx", "javascript"].includes(language)) return "javascript";
  if (["ts", "tsx", "typescript"].includes(language)) return "typescript";
  if (["html", "xml"].includes(language)) return "xml";
  if (["sh", "shell", "bash"].includes(language)) return "bash";
  return hljs.getLanguage(language) ? language : null;
}

export function CodeBlock({ code, language = "" }: { code: string; language?: string }) {
  const normalized = language.toLowerCase();
  const knownLanguage = highlighterLanguage(normalized);
  const highlighted = knownLanguage
    ? hljs.highlight(code, { language: knownLanguage }).value
    : hljs.highlightAuto(code).value;

  return (
    <figure className="not-typeset my-6 w-full min-w-0 max-w-full overflow-hidden rounded-lg border bg-[#f7f7f8] dark:bg-[#111214]" data-not-typeset>
      <figcaption className="flex h-10 items-center justify-between border-b px-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {languageNames[normalized] ?? (normalized || "Код")}
        </span>
        <CopyCodeButton code={code} />
      </figcaption>
      <pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-6 [tab-size:2] sm:text-sm">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </figure>
  );
}
