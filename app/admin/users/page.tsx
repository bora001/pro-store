import SearchContainer from "@/components/admin/search-container";
import DeleteButton from "@/components/common/delete-button";
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
import { getAllUsers } from "@/lib/actions/admin.actions";
import { deleteUser } from "@/lib/actions/user.action";
import { CONSTANTS, PATH } from "@/lib/constants";
import { idSlicer } from "@/lib/utils";
import Link from "next/link";
export const metadata = {
  title: "Users",
};
const ADMIN_USER = {
  HEADER: ["ID", "NAME", "EMAIL", "ROLE", "DETAIL"],
};
const AdminUserPage = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  const { page, query, category } = await props.searchParams;
  const data = await getAllUsers({ page: +page || 1, query, category });

  return (
    <SearchContainer
      title="Users"
      hasList={data.user.length === 0}
      resetPath={PATH.USERS}
      query={query}
      emptyText="No users available"
    >
      <Table className="table-fit">
        <TableHeader>
          <TableRow>
            {ADMIN_USER.HEADER.map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.user.map(({ id, name, email, role }) => (
            <TableRow key={id}>
              <TableCell>#{idSlicer(id)}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>
                <Badge
                  variant={role === CONSTANTS.ADMIN ? "default" : "secondary"}
                >
                  {role}
                </Badge>
              </TableCell>
              <TableCell className="space-x-1">
                <Link href={`${PATH.USERS}/${id}`}>
                  <Badge variant="outline" className="cursor-pointer">
                    Edit
                  </Badge>
                </Link>
                <DeleteButton
                  type="badge"
                  id={id}
                  action={deleteUser}
                  buttonLabel="delete-user-button"
                  returnPath={PATH.HOME}
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

export default AdminUserPage;
