import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Hunt Clone",
  description: "Discover and share new products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
