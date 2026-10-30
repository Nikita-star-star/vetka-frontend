import { SearchDialog } from "@/components/navigation/search-dialog";
import { ThemeMenu } from "@/components/navigation/theme-menu";
import { MobileCourseMenu } from "@/components/navigation/mobile-course-menu";
import { BrandLink } from "@/components/layout/brand-link";
import { FocusModeToggle } from "@/components/layout/focus-mode-toggle";
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
      <div className="relative mx-auto flex h-full max-w-[1920px] items-center gap-2 px-3 sm:px-5">
        <MobileCourseMenu lectures={lectures} labs={labs} />
        <BrandLink className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0" />
        <div className="ml-auto flex items-center gap-1.5">
          <FocusModeToggle />
          <SearchDialog entries={searchEntries} />
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
