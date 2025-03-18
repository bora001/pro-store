import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../assets/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { CONFIG } from "@/lib/constants/config";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s |${CONFIG.APP_NAME}`,
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
      <body className={`${inter.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
