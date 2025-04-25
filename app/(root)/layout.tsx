import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { CONSTANTS } from "@/lib/constants";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main
        style={{ paddingTop: `${CONSTANTS.HEADER_HEIGHT}px` }}
        className={`flex flex-col h-screen
          h-[calc(100vh-${CONSTANTS.HEADER_HEIGHT}px)]`}
      >
        <div className="flex-1 wrapper">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
