"use client";

import { useRouter } from "next/navigation";

export type ProductPeriod = "today" | "all";

type ProductPeriodSelectProps = {
  period: ProductPeriod;
};

export function ProductPeriodSelect({ period }: ProductPeriodSelectProps) {
  const router = useRouter();

  return (
    <select
      value={period}
      onChange={(event) => {
        const nextPeriod = event.target.value as ProductPeriod;
        router.push(nextPeriod === "today" ? "/" : "/?period=all");
      }}
      aria-label="Product time period"
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
    >
      <option value="today">Today</option>
      <option value="all">All time</option>
    </select>
  );
}
