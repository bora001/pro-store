import { Body, Column, Container, Head, Html, Preview, Row, Tailwind, Text } from "@react-email/components";
import LogoTemplate from "./logo-template";

const EmailVerificationTemplate = ({ token }: { token: string }) => {
  return (
    <Html>
      <Preview>Welcome to Pro-store!</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl mx-auto p-6 border border-solid border-gray-300 rounded-lg">
            <LogoTemplate />
            <Row className="mt-4">
              <Text className="text-lg text-gray-800">Hello! 🙌</Text>
            </Row>
            <Row className="mt-2">
              <Text className="text-base text-gray-700">
                Please enter the verification code below in the sign-up form.
              </Text>
            </Row>
            <Row className="mt-4">
              <Column className="inline-block px-3 bg-gray-900 text-white rounded-md font-bold">
                <Text>{token}</Text>
              </Column>
            </Row>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
EmailVerificationTemplate.PreviewProps = { token: "A12BDZ" };
export default EmailVerificationTemplate;
