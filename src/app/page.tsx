import { Suspense } from "react";
import { Pagination, parsePageParam, withPageParam } from "@/components/products/Pagination";
import { ProductList } from "@/components/products/ProductList";
import {
  ProductPeriodToggle,
  type ProductPeriod,
} from "@/components/products/ProductPeriodToggle";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import {
  listProducts,
  listProductsByTagSlug,
  listProductsForToday,
  withUserUpvoteState,
} from "@/lib/queries/products";
import { findTagBySlug } from "@/lib/queries/tags";
import type { PaginatedProducts } from "@/types/product";

type HomeProps = {
  searchParams: Promise<{ tag?: string; period?: string; page?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const period: ProductPeriod =
    params.period === "all" ? "all" : "today";
  const { tag } = params;
  const page = parsePageParam(params.page);
  const isToday = period === "today";
  const userId = await getCurrentUserId();

  let result: PaginatedProducts;
  let title: string;
  let emptyMessage: string;

  if (tag) {
    const tagRecord = await findTagBySlug(tag);
    result = await listProductsByTagSlug(tag, isToday, { page });
    title = tagRecord ? `Best in ${tagRecord.name}` : "Products";
    emptyMessage = tagRecord
      ? isToday
        ? `No products tagged with "${tagRecord.name}" launching today.`
        : `No products tagged with "${tagRecord.name}".`
      : "No products found for this tag.";
  } else if (isToday) {
    result = await listProductsForToday({ page });
    title = "Top Products Launching Today";
    emptyMessage = "No products launching today. Be the first to submit one.";
  } else {
    result = await listProducts({ page });
    title = "Top Products";
    emptyMessage = "No products yet. Be the first to submit one.";
  }

  const products = await withUserUpvoteState(result.products, userId);

  return (
    <main className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <Suspense fallback={null}>
          <ProductPeriodToggle period={period} />
        </Suspense>
      </div>
      <ProductList products={products} emptyMessage={emptyMessage} />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        hrefForPage={(nextPage) =>
          withPageParam("/", nextPage, {
            tag,
            period: period === "all" ? "all" : undefined,
          })
        }
      />
    </main>
  );
}
