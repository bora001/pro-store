import DealForm from "@/components/admin/deal/deal-form";
import Container from "@/components/common/container";
import DeleteButton from "@/components/common/delete-button";
import { deleteDeal, getDeal } from "@/lib/actions/handler/admin/admin.deal.actions";
import { getAllProducts } from "@/lib/actions/handler/product.actions";
import { PATH } from "@/lib/constants";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Deal" };
const EditDealPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const { data: deals } = await getDeal({ id });
  if (!deals) return notFound();
  const { data: allProducts } = await getAllProducts({});
  const products = JSON.parse(JSON.stringify(allProducts?.product));
  return (
    <Container>
      <Container.Header>
        <Container.Title title="Edit Deals" />
      </Container.Header>
      <Container.Body>
        <DealForm
          type="edit"
          deal={deals}
          products={products}
          dealId={deals.id}
          deleteButton={
            <DeleteButton
              variant="destructive"
              type="button"
              id={deals.id}
              returnPath={PATH.DEALS}
              action={deleteDeal}
              buttonLabel="delete-deal-button"
            />
          }
        />
      </Container.Body>
    </Container>
  );
};

export default EditDealPage;
