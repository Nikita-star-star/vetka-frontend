import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MaterialSummary } from "@/lib/course-types";

export function MaterialPagination({ previous, next }: { previous?: MaterialSummary; next?: MaterialSummary }) {
  if (!previous && !next) return null;
  return (
    <nav aria-label="Переход между материалами" className="mt-12 grid grid-cols-2 gap-3 border-t pt-6">
      {previous ? (
        <Link href={previous.href} className="group min-w-0 rounded-lg border p-3 transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-primary/30 hover:bg-muted/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4">
          <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" aria-hidden="true" /> Назад</span>
          <span className="block text-sm font-medium">{previous.title}</span>
        </Link>
      ) : <span />}
      {next && (
        <Link href={next.href} className="group min-w-0 rounded-lg border p-3 text-right transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-primary/30 hover:bg-muted/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4">
          <span className="mb-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">Далее <ArrowRight className="size-3.5" aria-hidden="true" /></span>
          <span className="block text-sm font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
