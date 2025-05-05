import ProductFormType from "@/components/admin/product/product-form";
import Container from "@/components/common/container";
import DeleteButton from "@/components/common/delete-button";
import {
  deleteProduct,
  getProduct,
  getTags,
} from "@/lib/actions/admin.actions";
import { PATH } from "@/lib/constants";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Product",
};
const EditProductPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const product = await getProduct(id, {
    include: {
      tags: true,
    },
  });
  const { data } = await getTags();
  if (!product) return notFound();

  return (
    <Container title="Edit Product">
      <ProductFormType
        type="edit"
        product={product}
        productId={product.id}
        allTags={data?.[0].tags || []}
        deleteButton={
          <DeleteButton
            variant="destructive"
            type="button"
            id={product.id}
            returnPath={PATH.PRODUCTS}
            action={deleteProduct}
            buttonLabel="delete-product-button"
          />
        }
      />
    </Container>
  );
};

export default EditProductPage;
