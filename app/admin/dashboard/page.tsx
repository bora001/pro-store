import OverviewChart from "@/components/admin/overview/overview-chart";
import Container from "@/components/common/container";
import ListContainer from "@/components/common/list-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/admin/admin.order.actions";
import { PATH } from "@/lib/constants";
import { dateTimeConverter } from "@/lib/utils";
import {
  BadgeDollarSign,
  Barcode,
  ChevronRight,
  CreditCard,
  User,
} from "lucide-react";
import Link from "next/link";
export const metadata = {
  title: "Dashboard",
};
const RECENT_SALES = {
  HEADER: ["BUYER", "DATE", "TOTAL", "DETAIL"],
};
const DashboardPage = async () => {
  const summary = await getOrderSummary();
  const summaryList = [
    {
      title: "Total Revenue",
      icon: <BadgeDollarSign />,
      text: `$ ${summary.totalSales._sum.totalPrice || 0}`,
      link: PATH.DASHBOARD,
    },
    {
      title: "Sales",
      icon: <CreditCard />,
      text: `${summary.orderCount}`,
      link: PATH.ORDERS,
    },
    {
      title: "Customers",
      icon: <User />,
      text: `${summary.userCount}`,
      link: PATH.USERS,
    },
    {
      title: "Product",
      icon: <Barcode />,
      text: `${summary.productCount}`,
      link: PATH.PRODUCTS,
    },
  ];
  return (
    <Container title="Dashboard">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryList.map(({ text, title, icon, link }) => (
            <Card key={title}>
              <Link href={link}>
                <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  {icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{text}</div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        {/* bottom */}
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-7">
          {/* overview */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ListContainer
                listLength={summary.salesData.length}
                title="No Sales Data"
              >
                <OverviewChart data={summary.salesData} />
              </ListContainer>
            </CardContent>
          </Card>
          {/* recent-sales */}
          <Card className="col-span-4 xl:col-span-3">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <p>Recent Sales</p>
                <Link
                  href={PATH.ORDERS}
                  className="text-sm text-gray-500"
                  aria-label="more sales"
                >
                  <ChevronRight />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ListContainer
                listLength={summary.latestSales.length}
                title="No Sales Data"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      {RECENT_SALES.HEADER.map((head) => (
                        <TableHead key={head}>{head}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.latestSales.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.user.name}</TableCell>
                        <TableCell>
                          {dateTimeConverter(order.createdAt)}
                        </TableCell>
                        <TableCell>{order.totalPrice}</TableCell>
                        <TableCell>
                          <Link href={`${PATH.ORDER}/${order.id}`}>
                            <Badge>Details</Badge>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ListContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default DashboardPage;
