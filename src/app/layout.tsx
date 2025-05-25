import "@fontsource/plus-jakarta-sans";
import "@fontsource/noto-sans";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Slather - Share Your Sandwich Experience",
  description:
    "Discover and share amazing sandwiches from restaurants and homemade creations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="relative flex size-full min-h-screen flex-col bg-background dark:bg-background overflow-x-hidden"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--background-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "var(--accent-primary)",
                secondary: "var(--background)",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "var(--error)",
                secondary: "var(--background)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
