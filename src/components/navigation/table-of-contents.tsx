"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/course-types";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const items = useMemo(
    () => headings.filter((heading) => heading.level === 2 || heading.level === 3),
    [headings],
  );
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [marker, setMarker] = useState({ top: 0, height: 16 });
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter((element): element is HTMLElement => Boolean(element));
    const lastId = items.at(-1)?.id;
    let frame = 0;

    const updateBottomState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!lastId) return;
        const documentElement = document.documentElement;
        const scrollTop = window.scrollY || documentElement.scrollTop;
        const pageHeight = Math.max(documentElement.scrollHeight, document.body.scrollHeight);
        if (scrollTop + window.innerHeight >= pageHeight - 4) {
          setActiveId(lastId);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        updateBottomState();
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    window.addEventListener("scroll", updateBottomState, { passive: true });
    updateBottomState();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateBottomState);
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !activeId) return;

    const updateMarker = () => {
      const link = Array.from(rail.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"))
        .find((element) => element.dataset.tocId === activeId);
      if (!link) return;

      const railRect = rail.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const top = linkRect.top - railRect.top;
      const height = linkRect.height;
      setMarker((current) =>
        Math.abs(current.top - top) < 0.5 && Math.abs(current.height - height) < 0.5
          ? current
          : { top, height },
      );
    };

    updateMarker();
    const resizeObserver = new ResizeObserver(updateMarker);
    resizeObserver.observe(rail);
    window.addEventListener("resize", updateMarker);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMarker);
    };
  }, [activeId]);

  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string, index: number) => {
    if (index !== 0) return;
    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  if (items.length < 2) return null;

  return (
    <nav aria-label="На этой странице" className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto px-5 py-2">
      <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground">На странице</p>
      <div ref={railRef} className="relative border-l border-border/70">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-px top-0 w-0.5 rounded-full bg-primary transition-[top,height] duration-500 ease-out will-change-[top,height]"
          style={{ top: `${marker.top}px`, height: `${marker.height}px` }}
        />
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleSectionClick(event, item.id, index)}
                data-toc-link
                data-toc-id={item.id}
                aria-current={activeId === item.id ? "location" : undefined}
                className={cn(
                  "block py-1 text-xs leading-5 text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground",
                  item.level === 3 ? "pl-5" : "pl-3",
                  activeId === item.id && "font-medium text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
