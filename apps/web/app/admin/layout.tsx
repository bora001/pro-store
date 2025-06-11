import { auth } from "@/auth";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { CONSTANTS, PATH } from "@/lib/constants";
import { ADMIN_NAV_LINK } from "@/lib/constants/nav-link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user.role !== CONSTANTS.ADMIN) redirect(PATH.HOME);

  return (
    <div className="flex h-screen flex-col">
      <Header navList={ADMIN_NAV_LINK} isAdmin={true} />
      <main className={`flex-1 wrapper`} style={{ marginTop: `${CONSTANTS.HEADER_HEIGHT}px` }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
