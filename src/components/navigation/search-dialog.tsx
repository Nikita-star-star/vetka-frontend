"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FlaskConical, Search } from "lucide-react";
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

export function SearchDialog({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

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

  const select = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <Button variant="outline" className="h-9 w-9 px-0 sm:w-52 sm:justify-start sm:px-3" onClick={() => setOpen(true)}>
        <Search />
        <span className="hidden text-muted-foreground sm:inline">Поиск по курсу</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Поиск по курсу"
        description="Ищите по лекциям, лабораторным и разделам"
        className="top-[18%] sm:max-w-xl"
      >
        <Command shouldFilter={false}>
          <CommandInput value={query} onValueChange={setQuery} placeholder="Компоненты, useState, Fetch…" autoFocus />
          <CommandList>
            <CommandEmpty>Ничего не найдено. Попробуйте другой запрос.</CommandEmpty>
            <CommandGroup heading={query ? "Результаты" : "Материалы курса"}>
              {results.map((entry) => (
                <CommandItem key={entry.id} value={entry.id} onSelect={() => select(entry.href)} className="items-start py-2.5">
                  {entry.kind === "lecture" ? <BookOpen className="mt-0.5" /> : <FlaskConical className="mt-0.5" />}
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{entry.section ?? entry.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {entry.section ? entry.title : entry.kind === "lecture" ? "Лекция" : "Лабораторная работа"}
                    </span>
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
