import ProductForm from "@/components/admin/product/product-form";
import Container from "@/components/common/container";
import { getTags } from "@/lib/actions/admin.actions";

export const metadata = {
  title: "Create Product",
};
const CreateProductPage = async () => {
  const { data } = await getTags();
  return (
    <Container title="Create Product">
      <ProductForm type="create" allTags={data?.[0].tags || []} />
    </Container>
  );
};

export default CreateProductPage;
