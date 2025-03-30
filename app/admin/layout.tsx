import { auth } from "@/auth";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { CONSTANTS, PATH } from "@/lib/constants";
import { redirect } from "next/navigation";

const NAV_LINK = [
  { title: "Dashboard", href: PATH.DASHBOARD },
  { title: "Products", href: PATH.PRODUCTS },
  { title: "Orders", href: PATH.ORDERS },
  { title: "Users", href: PATH.USERS },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user.role !== CONSTANTS.ADMIN) redirect(PATH.HOME);

  return (
    <div className="flex h-screen flex-col">
      <Header navList={NAV_LINK} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
