import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppHeader } from "@/components/layout/app-header";
import { PersistentCourseFrame } from "@/components/layout/persistent-course-frame";
import { getMaterialSummaries, getSearchIndex } from "@/lib/course";

const geist = Geist({ subsets: ["latin", "cyrillic"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  applicationName: "Ветка_",
  title: {
    default: "Ветка_ — курс React",
    template: "%s | Ветка_",
  },
  description: "Последовательный курс React для студентов, знакомых с HTML и CSS.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ lectures }, searchEntries] = await Promise.all([getMaterialSummaries(), getSearchIndex()]);
  return (
    <html lang="ru" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <a href="#main-content" className="skip-link">Перейти к содержимому</a>
          <AppHeader lectures={lectures} searchEntries={searchEntries} />
          <PersistentCourseFrame lectures={lectures}>
            {children}
          </PersistentCourseFrame>
        </Providers>
      </body>
    </html>
  );
}
