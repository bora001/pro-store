import { dateTimeConverter } from "@/lib/utils";
import Flex from "../common/flex";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
type OrderDetailCardPropsType = {
  title: string;
  detail: string;
  status: boolean;
  date: Date | null;
  badgeTitle: string[];
};
const OrderDetailCard = ({ title, detail, status, date, badgeTitle }: OrderDetailCardPropsType) => {
  const [successTitle, pendingTitle] = badgeTitle;
  const badgeDetail = status ? `${successTitle} ${dateTimeConverter(date)}` : pendingTitle;
  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <Flex className="gap-3 pb-4">
          <h2 className="text-xl">{title}</h2>
          <Badge variant={status ? "secondary" : "destructive"}>{badgeDetail}</Badge>
        </Flex>
        <p>{detail}</p>
      </CardContent>
    </Card>
  );
};

export default OrderDetailCard;
