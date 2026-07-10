import { Avatar } from "@/components/ui/Avatar";
import { ProductList } from "@/components/products/ProductList";
import type { ProductListItem } from "@/types/product";
import type { PublicUserProfile } from "@/types/user";

type UserProfileProps = {
  user: PublicUserProfile;
  products: ProductListItem[];
};

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
}

export function UserProfile({ user, products }: UserProfileProps) {
  return (
    <main className="py-8">
      <section className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar
          name={user.name}
          avatarUrl={user.avatar_url}
          className="h-24 w-24 text-2xl"
        />
        <div className="mt-4 sm:mt-0 sm:ml-6">
          <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
          <p className="mt-1 text-sm text-gray-500">@{user.username}</p>
          <p className="mt-1 text-sm text-gray-500">
            Member since {formatDate(user.created_at)}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            {user.product_count}{" "}
            {user.product_count === 1 ? "product" : "products"} launched
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Products</h2>
        <ProductList
          products={products}
          emptyMessage={`${user.name} has not launched any products yet.`}
        />
      </section>
    </main>
  );
}
