import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../assets/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { CONFIG } from "@/lib/constants/config";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${CONFIG.APP_NAME}`,
    default: `${CONFIG.APP_NAME}`,
  },
  description: `${CONFIG.APP_DESCRIPTION}`,
  metadataBase: new URL(CONFIG.APP_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://cdn.jsdelivr.net/npm/typesense@0.21.0/dist/typesense.min.js"
        strategy="afterInteractive"
      />
      <body className={`${inter.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
