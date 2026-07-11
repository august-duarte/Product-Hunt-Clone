"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProductPeriod = "today" | "all";

type ProductPeriodToggleProps = {
  period: ProductPeriod;
};

export function ProductPeriodToggle({ period }: ProductPeriodToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const togglePeriod = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (period === "today") {
      params.set("period", "all");
    } else {
      params.delete("period");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <button
      type="button"
      onClick={togglePeriod}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
    >
      {period === "today" ? "All time" : "Today"}
    </button>
  );
}
