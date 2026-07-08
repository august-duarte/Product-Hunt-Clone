"use client";

import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/components/layout/UserMenu";
import { HeaderSearchBar } from "@/components/layout/HeaderSearchBar";
import { contentWidthClass } from "@/components/layout/ContentContainer";

export function Header() {
  return (
    <header
      className={`sticky top-0 z-50 flex min-h-[4.5rem] items-center gap-4 border-b border-gray-300 bg-white px-6 py-4 ${contentWidthClass}`}
    >
      <Link
        href="/"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white hover:bg-orange-600"
        aria-label="Home"
      >
        P
      </Link>

      <div className="flex min-w-0 flex-1 justify-center px-2">
        <Suspense
          fallback={
            <div className="h-9 w-full max-w-md rounded-full border border-gray-300 bg-gray-50" />
          }
        >
          <HeaderSearchBar />
        </Suspense>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/products/new"
          className="rounded-full border-2 border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
        >
          + Submit
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
