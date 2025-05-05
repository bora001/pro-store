import TagBox from "@/components/admin/setting/tag-box";
import TextAreaBox from "@/components/admin/setting/textarea-box";
import Container from "@/components/common/container";
import { getSetting } from "@/lib/actions/admin.actions";

export const metadata = {
  title: "Setting",
};

const AdminUserPage = async () => {
  const { data } = await getSetting();
  return (
    <Container title="Setting" className="space-y-5">
      <div className="flex gap-4">
        <TextAreaBox
          type="prompt"
          data={data?.prompt || ""}
          title="System Prompt"
          placeholder="Enter your prompt"
        />
        <TextAreaBox
          data={data?.manual || ""}
          title="Manual Answer"
          placeholder="Enter your manual inputs"
          type="manual"
        />
      </div>
      <TextAreaBox
        data={data?.recommendation || ""}
        title="Recommendation Prompt"
        placeholder="Enter your recommendation prompt"
        type="recommendation"
      />
      <TagBox data={data?.tags || []} />
    </Container>
  );
};

export default AdminUserPage;
