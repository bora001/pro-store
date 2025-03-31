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
import { deleteProduct, getAllProducts } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { PATH } from "@/lib/constants";
import DeleteButton from "@/components/common/delete-button";
import Container from "@/components/common/container";

export const metadata = {
  title: "Products",
};
const ADMIN_ORDERS = {
  HEADER: ["ID", "NAME", "PRICE", "CATEGORY", "STOCK", "RATING", "DETAIL"],
};
const AdminProductPage = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  const { page, query, category } = await props.searchParams;
  const data = await getAllProducts({ page: +page || 1, query, category });
  if (data.product.length === 0)
    return (
      <div className="items-center justify-center flex h-full">
        No products available
      </div>
    );
  return (
    <Container
      title="Products"
      button={
        <Button>
          <Link href={PATH.CREATE_PRODUCTS}>Create Product</Link>
        </Button>
      }
    >
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
                <Link href={`${PATH.PRODUCTS}/${product.id}`}>
                  <Badge variant="outline" className="cursor-pointer">
                    Edit
                  </Badge>
                </Link>
                <DeleteButton
                  type="badge"
                  id={product.id}
                  action={deleteProduct}
                />
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
    </Container>
  );
};

export default AdminProductPage;
