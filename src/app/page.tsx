import Link from "next/link";
import { ArrowRight, BookOpen, Braces, FlaskConical, Layers3 } from "lucide-react";
import { ContinueButton } from "@/components/course/continue-button";
import { HomeMaterialList } from "@/components/course/home-material-list";
import { ProgressSummary } from "@/components/course/progress-summary";
import { buttonVariants } from "@/components/ui/button";
import { getCourseOverview, getMaterialSummaries } from "@/lib/course";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [{ title, intro }, { lectures }] = await Promise.all([getCourseOverview(), getMaterialSummaries()]);
  const firstLecture = lectures[0]?.href ?? "/labs";

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 py-10 outline-none sm:px-8 sm:py-16">
      <section className="grid gap-10 border-b pb-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-primary dark:text-[oklch(0.78_0.13_258)]">Последовательный курс · {lectures.length} лекций</p>
          <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.08]">{title}</h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{intro[0]}</p>
          <div className="mt-7"><ContinueButton firstLecture={firstLecture} /></div>
        </div>
        <div className="rounded-xl border bg-muted/25 p-5">
          <ProgressSummary lectureIds={lectures.map((item) => item.id)} labIds={[]} />
        </div>
      </section>

      <section className="grid gap-8 border-b py-12 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Что вы изучите</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-3"><Braces className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" /> Основы JavaScript, JSX и компонентный подход React.</li>
            <li className="flex gap-3"><Layers3 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" /> Props, состояние, формы, эффекты и Context API.</li>
            <li className="flex gap-3"><BookOpen className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" /> HTTP-запросы, маршрутизация и структура проекта.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Перед началом</h2>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">Достаточно уверенно владеть HTML и CSS. JavaScript объясняется с нуля до тех конструкций, которые понадобятся в React.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Идите по порядку, но открывайте любой материал, когда он нужен.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-sm text-muted-foreground">Теория</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Лекции</h2></div>
          <span className="text-sm text-muted-foreground">{lectures.length} материалов</span>
        </div>
        <HomeMaterialList materials={lectures} />
      </section>

      <section className="flex flex-col gap-5 border-t py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3"><FlaskConical className="mt-1 size-5 shrink-0" aria-hidden="true" /><div><h2 className="font-semibold">Лабораторные работы</h2><p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Три этапа лабораторных работ: от каталога задач до приложения с API и маршрутизацией.</p></div></div>
        <Link href="/labs" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>Перейти к лабораторным работам <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
