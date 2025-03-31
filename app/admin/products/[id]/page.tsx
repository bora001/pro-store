import ProductFormType from "@/components/admin/product/product-form";
import Container from "@/components/common/container";
import { getProduct } from "@/lib/actions/admin.actions";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Product",
};
const EditProductPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const product = await getProduct(id);
  if (!product) return notFound();
  return (
    <Container title="Edit Product">
      <ProductFormType type="edit" product={product} productId={product.id} />
    </Container>
  );
};

export default EditProductPage;
