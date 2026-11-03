"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function normalize(value: string) {
  return value.toLocaleLowerCase("ru").replace(/ё/g, "е");
}

export function SearchHighlight() {
  const searchParams = useSearchParams();
  const query = searchParams.get("highlight")?.trim();
  const announcementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (announcementRef.current) announcementRef.current.textContent = "";
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

    if (!node || index < 0) {
      if (announcementRef.current) announcementRef.current.textContent = `Слово «${term}» не найдено на странице.`;
      return;
    }

    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + term.length);
    const mark = document.createElement("mark");
    mark.className = "search-highlight";
    range.surroundContents(mark);

    const focusTarget = mark.closest<HTMLElement>("p, li, blockquote, dd, dt, h2, h3, h4") ?? mark;
    const hadTabIndex = focusTarget.hasAttribute("tabindex");
    if (!hadTabIndex) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.setAttribute("data-search-focus-target", "true");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mark.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });

    const context = focusTarget.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const frame = window.requestAnimationFrame(() => {
      focusTarget.focus({ preventScroll: true });
      if (announcementRef.current) {
        announcementRef.current.textContent = context
          ? `Найдено слово «${term}». ${context}`
          : `Найдено слово «${term}». Фокус перемещён к совпадению.`;
      }
    });

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
      window.cancelAnimationFrame(frame);
      window.clearTimeout(cleanup);
      removeMark();
      focusTarget.removeAttribute("data-search-focus-target");
      if (!hadTabIndex) focusTarget.removeAttribute("tabindex");
    };
  }, [query]);

  return (
    <p ref={announcementRef} className="sr-only" role="status" aria-live="polite" aria-atomic="true" />
  );
}
