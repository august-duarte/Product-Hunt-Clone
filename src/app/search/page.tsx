import { redirect } from "next/navigation";
import { Pagination, parsePageParam, withPageParam } from "@/components/products/Pagination";
import { ProductList } from "@/components/products/ProductList";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { searchProducts, withUserUpvoteState } from "@/lib/queries/products";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    redirect("/");
  }

  const page = parsePageParam(pageParam);
  const userId = await getCurrentUserId();
  const result = await searchProducts(query, { page });
  const products = await withUserUpvoteState(result.products, userId);

  return (
    <main className="py-8">
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Results for &ldquo;{query}&rdquo;
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        {result.total} {result.total === 1 ? "result" : "results"}
      </p>
      <ProductList
        products={products}
        emptyMessage={`No products found for "${query}".`}
      />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        hrefForPage={(nextPage) =>
          withPageParam("/search", nextPage, { q: query })
        }
      />
    </main>
  );
}
