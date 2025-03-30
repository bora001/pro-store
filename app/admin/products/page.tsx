import Pagination from "@/components/common/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { idSlicer } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllProducts } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Products",
};
const ADMIN_ORDERS = {
  HEADER: ["ID", "NAME", "PRICE", "CATEGORY", "STOCK", "RATING", "DETAIL"],
};
const AdminProductPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;
  const data = await getAllProducts({ page: +page || 1 });
  if (data.product.length === 0)
    return (
      <div className="items-center justify-center flex h-full">
        No products available
      </div>
    );
  return (
    <>
      <div className="flex justify-between items-center my-2 mb-4">
        <h2 className="h2-bold ">Products</h2>
        <Button>Create Product</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {ADMIN_ORDERS.HEADER.map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.product.map((product) => (
            <TableRow key={product.id}>
              <TableCell>#{idSlicer(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="space-x-1">
                <Badge variant="outline" className="cursor-pointer">
                  edit
                </Badge>
                <Link href={`/product/${product.id}`}>
                  <Badge variant="outline">Details</Badge>
                </Link>
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

export default AdminProductPage;
