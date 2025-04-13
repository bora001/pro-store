import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { CONSTANTS } from "@/lib/constants";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className={`flex-1 wrapper mt-[${CONSTANTS.HEADER_HEIGHT}px]`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
