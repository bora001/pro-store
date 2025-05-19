import DealForm from "@/components/admin/deal/deal-form";
import Container from "@/components/common/container";
import { getAllProducts } from "@/lib/actions/handler/product.actions";

export const metadata = {
  title: "Create Deal",
};
const CreateDealPage = async () => {
  const { data: allProducts } = await getAllProducts({});
  const products = JSON.parse(JSON.stringify(allProducts?.product)); //todo

  return (
    <Container title="Create Deal">
      <DealForm type="create" products={products} />
    </Container>
  );
};

export default CreateDealPage;
