"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CourseNavigation } from "@/components/navigation/course-navigation";
import type { MaterialSummary } from "@/lib/course-types";

export function MobileCourseMenu({ lectures, labs }: { lectures: MaterialSummary[]; labs: MaterialSummary[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Открыть навигацию по курсу" className="size-10 lg:hidden" />}>
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(90vw,22rem)] gap-0" >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Содержание курса</SheetTitle>
        </SheetHeader>
        <CourseNavigation className="min-h-0 flex-1" lectures={lectures} labs={labs} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
