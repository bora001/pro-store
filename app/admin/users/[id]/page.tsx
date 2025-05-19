import EditUserForm from "@/components/admin/user/user-form";
import Container from "@/components/common/container";
import { getUserById } from "@/lib/actions/handler/user.action";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Product",
};
const EditUserPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const { data: user } = await getUserById(id);
  if (!user) return notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <Container title="Edit User">
        <EditUserForm user={user} />
      </Container>
    </div>
  );
};

export default EditUserPage;
