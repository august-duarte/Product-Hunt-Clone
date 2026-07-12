import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-4 text-sm"
    >
      {prevPage ? (
        <Link
          href={hrefForPage(prevPage)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
          Previous
        </span>
      )}

      <span className="text-gray-600">
        Page {page} of {totalPages}
      </span>

      {nextPage ? (
        <Link
          href={hrefForPage(nextPage)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
          Next
        </span>
      )}
    </nav>
  );
}

export function parsePageParam(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function withPageParam(
  basePath: string,
  page: number,
  params: Record<string, string | undefined> = {},
): string {
  const searchParams = new URLSearchParams();

  for (const [key, paramValue] of Object.entries(params)) {
    if (paramValue) searchParams.set(key, paramValue);
  }

  if (page > 1) searchParams.set("page", String(page));

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}
