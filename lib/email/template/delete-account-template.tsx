import { Body, Container, Head, Html, Preview, Section, Tailwind, Text } from "@react-email/components";
import LogoTemplate from "./logo-template";

const DeleteAccountTemplate = ({ name }: { name: string }) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Preview>Goodbye! Account Deletion Confirmed</Preview>
          <Container className="max-w-2xl mx-auto p-6 border border-solid border-gray-300 rounded-lg">
            <LogoTemplate />
            <Section>
              <Text className="text-lg text-gray-800">Goodbye! {name}! 🍂</Text>
              <Text className="text-base text-gray-700">
                As requested, your account has been deleted. We value your feedback and would appreciate hearing any
                issues or suggestions you have for us.
              </Text>
              <Text className="text-base text-gray-700">we will be more than happy to welcome you back!</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
DeleteAccountTemplate.PreviewProps = { name: "bora" };
export default DeleteAccountTemplate;
