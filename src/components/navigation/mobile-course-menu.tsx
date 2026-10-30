"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CourseNavigation } from "@/components/navigation/course-navigation";
import type { MaterialSummary } from "@/lib/course-types";

export function MobileCourseMenu({ lectures, labs }: { lectures: MaterialSummary[]; labs: MaterialSummary[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Открыть навигацию по курсу" className="lg:hidden" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(90vw,22rem)] gap-0" aria-describedby="course-menu-description">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Содержание курса</SheetTitle>
          <SheetDescription id="course-menu-description">
            {lectures.length} лекций и {labs.length} лабораторные работы
          </SheetDescription>
        </SheetHeader>
        <CourseNavigation lectures={lectures} labs={labs} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
