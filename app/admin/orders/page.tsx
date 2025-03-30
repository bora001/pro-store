import DeleteButton from "@/components/common/delete-button";
import Pagination from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { getAllOrders } from "@/lib/actions/admin.actions";
import { deleteOrder } from "@/lib/actions/order.actions";
import { dateTimeConverter, idSlicer } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Orders",
};
const ADMIN_ORDERS = {
  HEADER: ["ID", "USER", "DATE", "TOTAL", "DELIVERED", "DETAIL"],
};
const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;
  const data = await getAllOrders({ page: +page || 1 });
  if (data.order.length === 0)
    return (
      <div className="items-center justify-center flex h-full">
        No orders have been placed yet
      </div>
    );
  return (
    <>
      <h2 className="h2-bold my-2 mb-4">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {ADMIN_ORDERS.HEADER.map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.order.map((order) => (
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
                <Link href={`/order/${order.id}`}>
                  <Badge>Details</Badge>
                </Link>
                <DeleteButton id={order.id} action={deleteOrder} type="badge" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        {data.totalPages > 1 && (
          <Pagination
            page={page || 1}
            urlParams="page"
            totalPages={data.totalPages}
          />
        )}
      </div>
    </>
  );
};

export default AdminOrdersPage;
