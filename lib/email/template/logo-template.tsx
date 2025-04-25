import { Heading, Img } from "@react-email/components";

const LogoTemplate = () => {
  return (
    <div className="flex items-center max-h-[40px]">
      <Img
        alt="Pro-Store logo"
        width={40}
        height={40}
        src={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`}
        className="block mr-3 mb-0"
      />
      <Heading className="text-xl font-semibold m-0" style={{ lineHeight: 0 }}>
        <p>Pro-Store</p>
      </Heading>
    </div>
  );
};

export default LogoTemplate;
