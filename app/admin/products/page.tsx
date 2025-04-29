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
import { deleteProduct, getAllAdminProduct } from "@/lib/actions/admin.actions";
import { PATH } from "@/lib/constants";
import DeleteButton from "@/components/common/delete-button";
import SearchContainer from "@/components/admin/search-container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Products",
};
const ADMIN_PRODUCT = {
  HEADER: ["ID", "NAME", "PRICE", "CATEGORY", "STOCK", "RATING", "DETAIL"],
};
const AdminProductPage = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  const { page, query, category } = await props.searchParams;
  const data = await getAllAdminProduct({ page: +page || 1, query, category });
  return (
    <SearchContainer
      title="Products"
      hasList={data.product.length === 0}
      resetPath={PATH.PRODUCTS}
      query={query}
      emptyText="No products available"
      extraButton={
        <Link href={PATH.CREATE_PRODUCTS}>
          <Button>Create Product</Button>
        </Link>
      }
    >
      <Table className="table-fit">
        <TableHeader>
          <TableRow>
            {ADMIN_PRODUCT.HEADER.map((head) => (
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
                  buttonLabel="delete-product-button"
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
    </SearchContainer>
  );
};

export default AdminProductPage;
