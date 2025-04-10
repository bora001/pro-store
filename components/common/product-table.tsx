"use client";
import ItemQtyChanger from "../cart/item-qty-changer";
import ItemRemoveButton from "../cart/item-remove-button";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "../ui/table";
import { OrderItemType, addDealType } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PATH } from "@/lib/constants";
import S3Image from "./S3Image";
import DiscountBadge from "../product/discount-badge";
import { discountPrice } from "@/utils/price/discountPrice";

const PRODUCT_TABLE_IMAGE_SIZE = 50;

const ProductTable = ({
  items,
  isView,
  deal,
  isActiveDeal,
}: {
  items: OrderItemType[];
  isView?: boolean;
  deal?: addDealType;
  isActiveDeal?: boolean;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const { productId: dealID, discount: deal_discount } = deal || {};
          const { name, slug, image, productId, price } = item;
          const isOrdered = item.dealInfo?.productId === productId;
          const discountCondition =
            (productId === dealID && isActiveDeal) ||
            item.dealInfo?.productId === productId;
          const discount = isOrdered ? item.dealInfo?.discount : deal_discount;
          return (
            <TableRow key={slug}>
              {/* image, name */}
              <TableCell>
                <Link
                  href={`${PATH.PRODUCT}/${slug}`}
                  className="flex items-center"
                >
                  <S3Image
                    folder="product"
                    fileName={image}
                    alt={name}
                    size={PRODUCT_TABLE_IMAGE_SIZE}
                  />
                  <div>
                    <span className="px-2" data-testid="product-name">
                      {name}
                    </span>
                    {discountCondition && (
                      <DiscountBadge discount={discount || 0} />
                    )}
                  </div>
                </Link>
              </TableCell>
              {/* quantity */}
              <TableCell
                className={cn(" gap-2", isView ? "text-center" : "flex-center")}
              >
                <ItemQtyChanger item={item} isView={isView} />
              </TableCell>
              {/* price */}
              <TableCell className="text-center">
                $ {discountPrice(+price, discount, discountCondition)}
              </TableCell>
              {!isView && (
                <TableCell>
                  <ItemRemoveButton item={item} />
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
