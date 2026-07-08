import { redirect } from "next/navigation";
import { ProductList } from "@/components/products/ProductList";
import { searchProducts } from "@/lib/queries/products";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    redirect("/");
  }

  const products = await searchProducts(query);

  return (
    <main className="py-8">
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Results for &ldquo;{query}&rdquo;
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        {products.length} {products.length === 1 ? "result" : "results"}
      </p>
      <ProductList
        products={products}
        emptyMessage={`No products found for "${query}".`}
      />
    </main>
  );
}
