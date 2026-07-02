"use client";

import Link from "next/link";
import { UserMenu } from "@/components/layout/UserMenu";
import { contentWidthClass } from "@/components/layout/ContentContainer";

export function Header() {
  return (
    <header
      className={`sticky top-0 z-50 flex min-h-[4.5rem] items-center justify-between border-b border-gray-300 bg-white px-6 py-4 ${contentWidthClass}`}
    >
      <Link
        href="/"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white hover:bg-orange-600"
        aria-label="Home"
      >
        P
      </Link>

      <nav className="flex items-center justify-center gap-4" />

      <UserMenu />
    </header>
  );
}
