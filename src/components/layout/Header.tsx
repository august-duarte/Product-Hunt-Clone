import Link from "next/link";

const navButtonStyles =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 hover:bg-gray-50";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 bg-white px-6 py-4">
      <nav className="flex items-center justify-center gap-4">
        <Link href="/" className={navButtonStyles}>
          Home
        </Link>
        <Link href="/register" className={navButtonStyles}>
          Register
        </Link>
        <Link href="/login" className={navButtonStyles}>
          Login
        </Link>
      </nav>
    </header>
  );
}
