"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Tag } from "@/types/tag";

type BestProductsMenuProps = {
  popularTags: Tag[];
};

const menuItemClass =
  "block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50";

export function BestProductsMenu({ popularTags }: BestProductsMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";
  const activeTag = searchParams.get("tag");
  const period = searchParams.get("period");

  const buildHomeHref = (tagSlug?: string) => {
    const params = new URLSearchParams();
    if (tagSlug) params.set("tag", tagSlug);
    if (period === "all") params.set("period", "all");
    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  const isBestActive = isHome && !activeTag;
  const isTagActive = (slug: string) => isHome && activeTag === slug;

  return (
    <div className="group relative shrink-0">
      <span className="cursor-default text-base font-medium text-gray-900">
        Best Products
      </span>

      <div className="absolute left-0 top-full z-50 hidden pt-1 group-hover:block">
        <div className="min-w-44 rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
          <Link
            href={buildHomeHref()}
            className={`${menuItemClass}${isBestActive ? " bg-gray-50 font-medium" : ""}`}
          >
            Best Products
          </Link>
          {popularTags.length > 0 && (
            <>
              <div className="my-1 border-t border-gray-200" />
              {popularTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={buildHomeHref(tag.slug)}
                  className={`${menuItemClass}${isTagActive(tag.slug) ? " bg-gray-50 font-medium" : ""}`}
                >
                  {tag.name}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
