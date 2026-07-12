import { Pagination, parsePageParam, withPageParam } from "@/components/products/Pagination";
import { ProductList } from "@/components/products/ProductList";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { listProducts, withUserUpvoteState } from "@/lib/queries/products";

type ProductsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const userId = await getCurrentUserId();
  const result = await listProducts({ page });
  const products = await withUserUpvoteState(result.products, userId);

  return (
    <main className="py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        All Products
      </h1>
      <ProductList
        products={products}
        emptyMessage="No products have been submitted yet."
      />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        hrefForPage={(nextPage) => withPageParam("/products", nextPage)}
      />
    </main>
  );
}
