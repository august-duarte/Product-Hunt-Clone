import { Suspense } from "react";
import { ProductList } from "@/components/products/ProductList";
import {
  ProductPeriodToggle,
  type ProductPeriod,
} from "@/components/products/ProductPeriodToggle";
import {
  listProducts,
  listProductsByTagSlug,
  listProductsForToday,
} from "@/lib/queries/products";
import { findTagBySlug } from "@/lib/queries/tags";
import type { ProductListItem } from "@/types/product";

type HomeProps = {
  searchParams: Promise<{ tag?: string; period?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const period: ProductPeriod =
    params.period === "all" ? "all" : "today";
  const { tag } = params;
  const isToday = period === "today";

  let products: ProductListItem[];
  let title: string;
  let emptyMessage: string;

  if (tag) {
    const tagRecord = await findTagBySlug(tag);
    products = await listProductsByTagSlug(tag, isToday);
    title = tagRecord ? `Best in ${tagRecord.name}` : "Products";
    emptyMessage = tagRecord
      ? isToday
        ? `No products tagged with "${tagRecord.name}" launching today.`
        : `No products tagged with "${tagRecord.name}".`
      : "No products found for this tag.";
  } else if (isToday) {
    products = await listProductsForToday();
    title = "Top Products Launching Today";
    emptyMessage = "No products launching today. Be the first to submit one.";
  } else {
    products = await listProducts();
    title = "Top Products";
    emptyMessage = "No products yet. Be the first to submit one.";
  }

  return (
    <main className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <Suspense fallback={null}>
          <ProductPeriodToggle period={period} />
        </Suspense>
      </div>
      <ProductList products={products} emptyMessage={emptyMessage} />
    </main>
  );
}
