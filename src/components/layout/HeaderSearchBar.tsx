"use client";

import { useSearchParams } from "next/navigation";

export function HeaderSearchBar() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <form action="/search" method="GET" className="w-full max-w-md">
      <input
        type="search"
        name="q"
        key={query}
        defaultValue={query}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
      />
    </form>
  );
}
