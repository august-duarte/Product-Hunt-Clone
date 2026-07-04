import { ProductList } from "@/components/products/ProductList";
import { listProducts } from "@/lib/queries/products";

export default async function Home() {
  const products = await listProducts();

  return (
    <main className="py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Top products
      </h1>
      <ProductList products={products} />
    </main>
  );
}
