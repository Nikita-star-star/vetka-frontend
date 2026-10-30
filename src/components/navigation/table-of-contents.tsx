"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/course-types";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const items = headings.filter((heading) => heading.level === 2 || heading.level === 3);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="На этой странице" className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto px-5 py-2">
      <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground">На странице</p>
      <ul className="space-y-1 border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l border-transparent py-1 text-xs leading-5 text-muted-foreground transition-colors hover:text-foreground",
                item.level === 3 ? "pl-5" : "pl-3",
                activeId === item.id && "border-primary font-medium text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
