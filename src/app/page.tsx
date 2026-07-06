import Link from "next/link";
import { ProductList } from "@/components/products/ProductList";
import { listProductsForToday } from "@/lib/queries/products";

export default async function Home() {
  const products = await listProductsForToday();

  return (
    <main className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Top Products Launching Today
        </h1>
        <Link
          href="/products"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
        >
          View all products
        </Link>
      </div>
      <ProductList
        products={products}
        emptyMessage="No products launching today. Be the first to submit one."
      />
    </main>
  );
}
