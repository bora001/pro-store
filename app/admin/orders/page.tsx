import SearchContainer from "@/components/admin/common/search-container";
import DeleteButton from "@/components/common/delete-button";
import Pagination from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { getAllOrders } from "@/lib/actions/handler/admin/admin.order.actions";
import { deleteOrder } from "@/lib/actions/handler/admin/admin.order.actions";
import { PATH } from "@/lib/constants";
import { dateTimeConverter, idSlicer } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Orders" };
const ADMIN_ORDERS = { HEADER: ["ID", "USER", "DATE", "TOTAL", "DELIVERED", "DETAIL"] };
const AdminOrdersPage = async (props: { searchParams: Promise<{ page: string; query: string }> }) => {
  const { page, query } = await props.searchParams;
  const { data } = await getAllOrders({ page: +page || 1, query });
  return (
    <SearchContainer
      title="Orders"
      noList={data?.order.length === 0}
      resetPath={PATH.ORDERS}
      query={query}
      emptyText="No orders have been placed yet"
    >
      <Table className="table-fit">
        <TableHeader>
          <TableRow>
            {ADMIN_ORDERS.HEADER.map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.order.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{idSlicer(order.id)}</TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{dateTimeConverter(order.createdAt)}</TableCell>
              <TableCell>${order.totalPrice}</TableCell>
              <TableCell>
                <Badge variant={order.isDelivered ? "outline" : "destructive"}>
                  {order.isDelivered ? "isDelivered" : "not delivered"}
                </Badge>
              </TableCell>
              <TableCell className="space-x-1">
                <Link href={`${PATH.ORDER}/${order.id}`}>
                  <Badge variant="outline">Details</Badge>
                </Link>
                <DeleteButton id={order.id} action={deleteOrder} type="badge" buttonLabel="delete-order-button" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        {data && data.totalPages > 1 && <Pagination page={page || 1} urlParams="page" totalPages={data.totalPages} />}
      </div>
    </SearchContainer>
  );
};

export default AdminOrdersPage;
