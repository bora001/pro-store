import DealForm from "@/components/admin/deal/deal-form";
import Container from "@/components/common/container";
import { getAllProducts } from "@/lib/actions/handler/product.actions";

export const metadata = { title: "Create Deal" };
const CreateDealPage = async () => {
  const { data: allProducts } = await getAllProducts({});
  const products = JSON.parse(JSON.stringify(allProducts?.product)); //todo

  return (
    <Container>
      <Container.Header>
        <Container.Title title="Create Deal" />
      </Container.Header>
      <Container.Body>
        <DealForm type="create" products={products} />
      </Container.Body>
    </Container>
  );
};

export default CreateDealPage;
