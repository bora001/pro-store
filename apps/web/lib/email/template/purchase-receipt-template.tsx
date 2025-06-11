import sampleData from "@/db/sample-data";
import { PAYMENT_METHODS } from "@/lib/constants";
import { CONFIG } from "@/lib/constants/config";
import { dateTimeConverter, formatNumberWithDecimal } from "@/lib/utils";
import { OrderType } from "@/types";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const PurchaseReceiptTemplate = ({ order }: { order: Omit<OrderType, "payment"> }) => {
  const InfoColumn = ({ title, value }: { title: string; value: string | number }) => (
    <Column>
      <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">{title}</Text>
      <Text className="mt-0 mr-4">{value}</Text>
    </Column>
  );

  const PRICE_LIST = [
    { name: "Item", price: order.itemPrice },
    { name: "Tax", price: order.taxPrice },
    { name: "Shipping", price: order.shippingPrice },
    { name: "Total", price: order.totalPrice },
  ];
  return (
    <Html>
      <Preview>View Order Receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>[Demo] - Purchase Receipt</Heading>
            <Section>
              <Row>
                <InfoColumn title="Order ID" value={order.id} />
                <InfoColumn title="Purchase Date" value={dateTimeConverter(order.createdAt)} />
                <InfoColumn title="Price Paid" value={`$${order.totalPrice}`} />
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-5 md:p-6">
              {order.orderItems.map(({ productId, name, qty, price, image }) => {
                return (
                  <Row key={productId} className="py-3 border-b-2 border-solid border-gray-300">
                    <Column className="w-20">
                      <Img width="50" className="rounded" src={`${CONFIG.IMAGE_URL}/product/${image}`} alt={name} />
                    </Column>
                    <Column>
                      {name} x {qty}
                    </Column>
                    <Column align="right">${price}</Column>
                  </Row>
                );
              })}
              <div className="mt-4">
                {PRICE_LIST.map(({ name, price }) => (
                  <Row key={name} className="py-1">
                    <Column align="right">{name} : </Column>
                    <Column align="right" width={70}>
                      $ {formatNumberWithDecimal(+price)}
                    </Column>
                  </Row>
                ))}
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
PurchaseReceiptTemplate.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "ID123",
    user: { name: "John Doe", email: "test@test.co" },
    payment: PAYMENT_METHODS.Stripe.key,
    address: { name: "John Doe", city: "New york", address: "123 Main st", postalCode: "10001", country: "US" },
    createdAt: new Date(),
    shippingPrice: "0",
    taxPrice: "10.10",
    itemPrice: "90",
    totalPrice: "100.10",
    orderItems: sampleData.products.map(({ name, slug, images, price }) => ({
      name,
      orderId: "order1111",
      productId: "product1111",
      slug,
      qty: 3,
      image: images[0],
      price,
    })),
    isDelivered: false,
    deliveredAt: null,
    isPaid: true,
    paidAt: new Date(),
    paymentResult: { id: "paymentId", status: "succeeded", pricePaid: "100.10", email_address: "test@test.co" },
  },
};

export default PurchaseReceiptTemplate;
