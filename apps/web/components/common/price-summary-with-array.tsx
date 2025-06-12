import { capitalize, currencyFormatter } from "@/lib/utils";

const PriceSummaryWithArray = ({ price }: { price: [string, string][] }) => {
  return (
    <div className="space-y-2">
      {price.map(([title, value]) => (
        <div className="flex justify-between" key={title}>
          <div className="text-base">
            {capitalize(title.replace("Price", ""))}
          </div>
          <div data-testid={`${title}-price`} className="text-base">
            {currencyFormatter.format(+value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceSummaryWithArray;
