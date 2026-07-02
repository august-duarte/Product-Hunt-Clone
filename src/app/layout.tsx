import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { UserAuthProvider } from "@/hooks/user-auth";
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
        <UserAuthProvider>
          <Header />
          <Script
            src="https://cdn.tailwindcss.com"
            strategy="beforeInteractive"
          />
          <ContentContainer>{children}</ContentContainer>
        </UserAuthProvider>
      </body>
    </html>
  );
}
