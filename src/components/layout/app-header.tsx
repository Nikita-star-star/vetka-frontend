import Link from "next/link";
import Image from "next/image";
import { SearchDialog } from "@/components/navigation/search-dialog";
import { ThemeMenu } from "@/components/navigation/theme-menu";
import { MobileCourseMenu } from "@/components/navigation/mobile-course-menu";
import type { MaterialSummary, SearchEntry } from "@/lib/course-types";

export function AppHeader({
  lectures,
  labs,
  searchEntries,
}: {
  lectures: MaterialSummary[];
  labs: MaterialSummary[];
  searchEntries: SearchEntry[];
}) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full max-w-[1920px] items-center gap-2 px-3 sm:px-5">
        <MobileCourseMenu lectures={lectures} labs={labs} />
        <Link
          href="/"
          aria-label="Ветка_ — главная"
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-8 shrink-0 items-center justify-center">
            <Image
              src="/Logo_vetka.png"
              alt=""
              width={240}
              height={240}
              priority
              className="size-6 object-contain invert dark:invert-0"
              aria-hidden="true"
            />
          </span>
          <span className="text-[15px] font-semibold leading-none tracking-tight">
            Ветка_
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          <SearchDialog entries={searchEntries} />
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
