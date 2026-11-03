"use client";

import { useState } from "react";
import { Check, Copy } from "lucide";
import { MorphIcon } from "morphicons/react";
import { Button } from "@/components/ui/button";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground"
        onClick={copy}
        aria-label={copied ? "Код скопирован" : "Копировать код"}
      >
        <MorphIcon
          icon={copied ? Check : Copy}
          className="size-4"
          spring="smooth"
          reducedMotion="user"
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{copied ? "Скопировано" : "Копировать"}</span>
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Код скопирован" : ""}
      </span>
    </>
  );
}
