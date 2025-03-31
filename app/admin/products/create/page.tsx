import ProductForm from "@/components/admin/product/product-form";
import Container from "@/components/common/container";

export const metadata = {
  title: "Create Product",
};
const CreateProductPage = () => {
  return (
    <Container title="Create Product">
      <ProductForm type="create" />
    </Container>
  );
};

export default CreateProductPage;
