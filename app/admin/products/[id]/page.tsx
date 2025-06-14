import ProductFormType from "@/components/admin/product/product-form";
import Container from "@/components/common/container";
import DeleteButton from "@/components/common/delete-button";
import { deleteProduct, getProduct } from "@/lib/actions/handler/admin/admin.product.actions";
import { getTags } from "@/lib/actions/handler/admin/admin.setting.actions";
import { PATH } from "@/lib/constants";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Product" };
const EditProductPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const { data: product } = await getProduct({ id, props: { include: { tags: true } } });
  const { data } = await getTags();
  if (!product) return notFound();

  return (
    <Container>
      <Container.Header>
        <Container.Title title="Edit Product" />
      </Container.Header>
      <Container.Body>
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
      </Container.Body>
    </Container>
  );
};

export default EditProductPage;
