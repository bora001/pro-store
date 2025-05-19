import ProductForm from "@/components/admin/product/product-form";
import Container from "@/components/common/container";
import { getTags } from "@/lib/actions/handler/admin/admin.setting.actions";

export const metadata = { title: "Create Product" };
const CreateProductPage = async () => {
  const { data } = await getTags();
  return (
    <Container>
      <Container.Header>
        <Container.Title title="Create Product" />
      </Container.Header>
      <Container.Body>
        <ProductForm type="create" allTags={data?.[0].tags || []} />
      </Container.Body>
    </Container>
  );
};

export default CreateProductPage;
