import Container from "@/components/common/container";
import ListContainer from "@/components/common/list-container";
import Pagination from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserOrder } from "@/lib/actions/order.actions";
import { PATH } from "@/lib/constants";
import { dateTimeConverter, idSlicer } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "My order",
};
const MyOrderPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;
  const order = await getUserOrder({ page: +page || 1 });
  const TABLE_HEAD = ["ID", "DATE", "TOTAL", "PAID", "DELIVERED", "DETAILS"];

  return (
    <Container title="My Order">
      <ListContainer
        title="No orders have been placed yet"
        listLength={order.data.length}
      >
        <div className="overflow-x-auto h-full flex flex-col justify-between">
          {/* table */}
          <Table className="table-fit">
            {/* header */}
            <TableHeader>
              <TableRow>
                {TABLE_HEAD.map((head) => (
                  <TableHead key={head}>{head}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {/* body */}
            <TableBody>
              {order.data.map((orderItem) => (
                <TableRow key={orderItem.id}>
                  <TableCell># {idSlicer(orderItem.id)}</TableCell>
                  <TableCell>
                    {dateTimeConverter(orderItem.createdAt)}
                  </TableCell>
                  <TableCell>$ {orderItem.totalPrice}</TableCell>
                  <TableCell>
                    <Badge
                      variant={orderItem.isPaid ? "outline" : "destructive"}
                    >
                      {orderItem.isPaid ? "Paid" : "unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        orderItem.isDelivered ? "outline" : "destructive"
                      }
                    >
                      {orderItem.isDelivered ? "delivered" : "not delivered"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`${PATH.ORDER}/${orderItem.id}`}>
                      <Badge>Detail</Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* pagination */}
          <div className="flex justify-center">
            {order.totalPages > 1 && (
              <Pagination
                page={page || 1}
                urlParams="page"
                totalPages={order.totalPages}
              />
            )}
          </div>
        </div>
      </ListContainer>
    </Container>
  );
};

export default MyOrderPage;
