"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FlaskConical, History, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchEntry } from "@/lib/course-types";

function normalize(value: string) {
  return value.toLocaleLowerCase("ru").replace(/ё/g, "е");
}

function searchTerm(query: string) {
  return query.trim().split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length)[0] ?? "";
}

function SearchFragment({ text, query }: { text: string; query: string }) {
  const term = searchTerm(query);
  if (!term) return null;
  const index = normalize(text).indexOf(normalize(term));
  if (index < 0) return <>{text.slice(0, 150)}{text.length > 150 ? "…" : ""}</>;

  const start = Math.max(0, index - 56);
  const end = Math.min(text.length, index + term.length + 92);
  return (
    <>
      {start > 0 ? "…" : ""}
      {text.slice(start, index)}
      <mark className="search-result-highlight">{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length, end)}
      {end < text.length ? "…" : ""}
    </>
  );
}

const SEARCH_HISTORY_KEY = "react-course-search-history";

export function SearchDialog({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SEARCH_HISTORY_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) window.setTimeout(() => setHistory(parsed.filter((item) => typeof item === "string").slice(0, 2)), 0);
    } catch {
      // Search remains available when local storage is disabled or malformed.
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return entries.filter((entry) => !entry.section).slice(0, 12);
    return entries
      .map((entry) => {
        const title = normalize(`${entry.title} ${entry.section ?? ""}`);
        const body = normalize(entry.excerpt);
        const matched = terms.every((term) => title.includes(term) || body.includes(term));
        const score = terms.reduce(
          (total, term) => total + (title.includes(term) ? 4 : 0) + (body.includes(term) ? 1 : 0),
          0,
        );
        return { entry, matched, score };
      })
      .filter((result) => result.matched)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map((result) => result.entry);
  }, [entries, query]);

  const select = (entry: SearchEntry) => {
    const search = query.trim();
    if (search) {
      const nextHistory = [search, ...history.filter((item) => item !== search)].slice(0, 2);
      setHistory(nextHistory);
      try {
        window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));
      } catch {
        // Navigation still works when local storage is unavailable.
      }
    }
    setOpen(false);
    setQuery("");
    const [path, hash] = entry.href.split("#");
    const href = search
      ? `${path}?highlight=${encodeURIComponent(search)}${hash ? `#${hash}` : ""}`
      : entry.href;
    router.push(href);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="h-10 w-10 px-0 sm:h-9 sm:w-52 sm:justify-start sm:bg-muted/40 sm:px-3 sm:hover:bg-muted/70"
        onClick={() => setOpen(true)}
        aria-label="Открыть поиск по курсу ⌘K"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Search className="size-5 sm:size-4" aria-hidden="true" />
        <span className="hidden text-muted-foreground sm:inline">Поиск по курсу</span>
        <kbd aria-hidden="true" className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setQuery("");
        }}
        title="Поиск по курсу"
        description="Ищите по лекциям, лабораторным и разделам"
        showCloseButton
        className="top-[12%] max-w-[calc(100%-1rem)] [&_[data-slot=command-input-wrapper]]:pr-10 sm:top-[18%] sm:max-w-xl"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Компоненты, useState, Fetch…"
            aria-label="Поиск по лекциям и лабораторным работам"
            autoFocus
          />
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {query.trim()
              ? results.length
                ? `Найдено результатов: ${results.length}. Используйте стрелки вверх и вниз для выбора.`
                : "По вашему запросу ничего не найдено."
              : "Введите запрос для поиска по курсу."}
          </p>
          <CommandList>
            <CommandEmpty>Ничего не найдено. Попробуйте другой запрос.</CommandEmpty>
            {!query.trim() && history.length > 0 && (
              <CommandGroup heading="Недавние поиски">
                {history.map((item) => (
                  <CommandItem key={`history-${item}`} value={`history-${item}`} className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm" onSelect={() => setQuery(item)}>
                    <History className="size-5 text-muted-foreground sm:size-4" aria-hidden="true" />
                    <span className="truncate">{item}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup heading={query ? "Результаты" : "Материалы курса"}>
              {results.map((entry) => (
                <CommandItem key={entry.id} value={entry.id} onSelect={() => select(entry)} className="items-start min-h-14 py-3 text-base sm:min-h-0 sm:py-2.5 sm:text-sm">
                  {entry.kind === "lecture" ? <BookOpen className="mt-0.5 size-5 sm:size-4" aria-hidden="true" /> : <FlaskConical className="mt-0.5 size-5 sm:size-4" aria-hidden="true" />}
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{entry.section ?? entry.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {entry.section ? entry.title : entry.kind === "lecture" ? "Лекция" : "Лабораторная работа"}
                    </span>
                    {query.trim() && (
                      <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted-foreground">
                        <SearchFragment text={entry.excerpt} query={query} />
                      </span>
                    )}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
