import Pagination from "@/components/common/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  capitalize,
  dateTimeConverter,
  idSlicer,
  prismaToJs,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  deleteDeal,
  getAllDeals,
  getAllProducts,
} from "@/lib/actions/admin.actions";
import { PATH } from "@/lib/constants";
import DeleteButton from "@/components/common/delete-button";
import SearchContainer from "@/components/admin/search-container";
import { Button } from "@/components/ui/button";
import DealActiveSwitch from "@/components/admin/deal/deal-active-switch";

export const metadata = {
  title: "Deals",
};
const ADMIN_PRODUCT = {
  HEADER: [
    "ID",
    "TYPE",
    "TITLE",
    "DISCOUNT",
    "PRODUCT",
    "END DATE",
    "IS ACTIVE",
    "DETAIL",
  ],
};
const AdminDealsPage = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  const currentDate = new Date();
  const { page, query, category } = await props.searchParams;
  const data = await getAllProducts({ page: +page || 1, query, category });
  const deals = await getAllDeals({ page: +page || 1, query });

  return (
    <SearchContainer
      title="Deals"
      hasList={deals.length === 0}
      resetPath={PATH.DEALS}
      query={query}
      emptyText="No deals available"
      extraButton={
        <Link href={PATH.CREATE_DEALS}>
          <Button>Create Deal</Button>
        </Link>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            {ADMIN_PRODUCT.HEADER.map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => {
            const isValidDate = deal.endTime > currentDate;
            return (
              <TableRow key={deal.id}>
                <TableCell>#{idSlicer(deal.id)}</TableCell>
                <TableCell>
                  <Badge>{capitalize(deal.type)}</Badge>
                </TableCell>
                <TableCell>{deal.title}</TableCell>
                <TableCell>
                  <Badge>{deal.discount}%</Badge>
                </TableCell>
                <TableCell>{deal.product.name}</TableCell>
                <TableCell>
                  <Badge variant={isValidDate ? "secondary" : "destructive"}>
                    {dateTimeConverter(deal.endTime)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DealActiveSwitch
                    activeStatus={deal.isActive}
                    isValidDate={isValidDate}
                    deal={prismaToJs(deal)}
                  />
                </TableCell>
                <TableCell className="space-x-1">
                  <Link href={`${PATH.DEALS}/${deal.id}`}>
                    <Badge variant="outline" className="cursor-pointer">
                      Edit
                    </Badge>
                  </Link>
                  <DeleteButton type="badge" id={deal.id} action={deleteDeal} />
                </TableCell>
              </TableRow>
            );
          })}
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

export default AdminDealsPage;
