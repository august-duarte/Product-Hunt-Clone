import { ProductCard } from "@/components/products/ProductCard";
import type { ProductListItem } from "@/types/product";

type ProductListProps = {
  products: ProductListItem[];
  emptyMessage?: string;
};

export function ProductList({
  products,
  emptyMessage = "No products yet. Be the first to submit one.",
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">{emptyMessage}</p>
    );
  }

  return (
    <div>
      {products.map((product, index) => (
        <ProductCard key={product.id} rank={index + 1} product={product} />
      ))}
    </div>
  );
}
