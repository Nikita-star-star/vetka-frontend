import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-xl flex-col items-center justify-center px-5 text-center outline-none">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 text-2xl font-semibold">Материал не найден</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Возможно, ссылка устарела или файл был перемещён.</p>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6 gap-2")}><ArrowLeft aria-hidden="true" /> На главную</Link>
    </main>
  );
}
