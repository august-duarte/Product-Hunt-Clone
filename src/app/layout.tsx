import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { ThemeProvider } from "@/hooks/theme";
import { UserAuthProvider } from "@/hooks/user-auth";
import { listPopularTags } from "@/lib/queries/tags";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Hunt Clone",
  description: "Discover and share new products",
};

const themeInitScript = `
(() => {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const popularTags = await listPopularTags();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <UserAuthProvider>
            <Header popularTags={popularTags} />
            <Script
              src="https://cdn.tailwindcss.com"
              strategy="beforeInteractive"
            />
            <ContentContainer>{children}</ContentContainer>
          </UserAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
