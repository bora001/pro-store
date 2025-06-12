import { Body, Container, Head, Html, Preview, Row, Tailwind, Text } from "@react-email/components";
import { Section } from "lucide-react";
import LogoTemplate from "./logo-template";

const WelcomeMailTemplate = ({ name }: { name: string }) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Preview>Welcome to Pro-store!</Preview>
          <Container className="max-w-2xl mx-auto p-6 border border-solid border-gray-300 rounded-lg">
            <LogoTemplate />
            <Section>
              <Text className="text-lg text-gray-800">Hello {name}! 🙌</Text>
              <Text className="text-base text-gray-700">
                Thank you for signing up at Pro-Store! We are thrilled to have you on board.
              </Text>
              <Text className="text-base text-gray-700">Feel free to explore our platform! 🚀</Text>
            </Section>
            <Section>
              <Row className="inline-block px-3 bg-gray-900 text-white rounded-md mt-4">
                <Text className="font-bold">
                  Support:{" "}
                  <a href="mailto:demo.pro.store@gmail.com" className="text-white">
                    demo.pro.store@gmail.com
                  </a>
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
WelcomeMailTemplate.PreviewProps = { name: "bora", email: "test@email.com" };
export default WelcomeMailTemplate;
