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
    <html lang="en">
      <body
        className="relative flex size-full min-h-screen flex-col bg-[#fbfaf9] group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#191310",
              border: "1px solid #eccebf",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#eccebf",
                secondary: "#191310",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#f87171",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
