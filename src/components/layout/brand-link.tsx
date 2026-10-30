"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function BrandLink() {
  const [logoTransform, setLogoTransform] = useState("translate(0px, 0px) rotate(0deg)");

  const randomizeLogo = () => {
    const x = (Math.random() * 2 - 1).toFixed(2);
    const y = (Math.random() * 2 - 1).toFixed(2);
    const rotation = (Math.random() * 8 - 4).toFixed(2);
    setLogoTransform(`translate(${x}px, ${y}px) rotate(${rotation}deg)`);
  };

  return (
    <Link
      href="/"
      aria-label="Ветка_ — главная"
      onPointerEnter={randomizeLogo}
      onPointerLeave={() => setLogoTransform("translate(0px, 0px) rotate(0deg)")}
      className="brand-link group flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Image
          src="/Logo_vetka.png"
          alt=""
          width={240}
          height={240}
          priority
          style={{ transform: logoTransform }}
          className="brand-logo size-6 object-contain invert dark:invert-0"
          aria-hidden="true"
        />
      </span>
      <span className="text-[15px] font-semibold leading-none tracking-tight">Ветка_</span>
    </Link>
  );
}
