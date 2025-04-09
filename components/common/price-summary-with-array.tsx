import { capitalize, currencyFormatter } from "@/lib/utils";

const PriceSummaryWithArray = ({ price }: { price: [string, number][] }) => {
  return (
    <div className="space-y-1">
      {price.map(([title, value]) => (
        <div className="flex justify-between" key={title}>
          <div className="text-base">{capitalize(title)}</div>
          <div>{currencyFormatter.format(value)}</div>
        </div>
      ))}
    </div>
  );
};

export default PriceSummaryWithArray;
