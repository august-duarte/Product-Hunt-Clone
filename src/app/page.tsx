import { ProductList } from "@/components/products/ProductList";
import {
  ProductPeriodSelect,
  type ProductPeriod,
} from "@/components/products/ProductPeriodSelect";
import {
  listProducts,
  listProductsForToday,
} from "@/lib/queries/products";

type HomePageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const period: ProductPeriod =
    params.period === "all" ? "all" : "today";

  const products =
    period === "today"
      ? await listProductsForToday()
      : await listProducts();

  const title =
    period === "today"
      ? "Top Products Launching Today"
      : "Top Products Launched";

  const emptyMessage =
    period === "today"
      ? "No products launching today. Be the first to submit one."
      : "No products yet. Be the first to submit one.";

  return (
    <main className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <ProductPeriodSelect period={period} />
      </div>
      <ProductList products={products} emptyMessage={emptyMessage} />
    </main>
  );
}
