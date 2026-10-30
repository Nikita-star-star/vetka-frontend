"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

function normalize(value: string) {
  return value.toLocaleLowerCase("ru").replace(/ё/g, "е");
}

export function SearchHighlight() {
  const searchParams = useSearchParams();
  const query = searchParams.get("highlight")?.trim();

  useEffect(() => {
    const term = query?.split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length)[0];
    const root = document.querySelector<HTMLElement>("[data-search-content]");
    if (!term || !root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent?.trim() || node.parentElement?.closest("pre, code, table, script, style, [data-not-typeset]")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node: Text | null = null;
    let index = -1;
    while (walker.nextNode()) {
      const current = walker.currentNode as Text;
      const found = normalize(current.nodeValue ?? "").indexOf(normalize(term));
      if (found >= 0) {
        node = current;
        index = found;
        break;
      }
    }

    if (!node || index < 0) return;

    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + term.length);
    const mark = document.createElement("mark");
    mark.className = "search-highlight";
    range.surroundContents(mark);
    mark.scrollIntoView({ behavior: "smooth", block: "center" });

    const removeMark = () => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
        parent.removeChild(mark);
      }
    };

    const cleanup = window.setTimeout(() => {
      removeMark();
      const url = new URL(window.location.href);
      url.searchParams.delete("highlight");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 1800);

    return () => {
      window.clearTimeout(cleanup);
      removeMark();
    };
  }, [query]);

  return null;
}
