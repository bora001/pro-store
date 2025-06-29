"use client";

import ItemQtyChanger from "../cart/item-qty-changer";
import ItemRemoveButton from "../cart/item-remove-button";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "../ui/table";
import { OrderItemType, AddDealType } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PATH } from "@/lib/constants";
import S3Image from "./S3Image";
import DiscountBadge from "../product/discount-badge";
import { discountPrice } from "@/utils/price/discountPrice";
import { Badge } from "../ui/badge";

const PRODUCT_TABLE_IMAGE_SIZE = 50;
type ProductTablePropsType = {
  items: OrderItemType[];
  isView?: boolean;
  deal?: AddDealType;
  isActiveDeal?: boolean;
  cartId?: string;
};
const ProductTable = ({ items, isView, deal, isActiveDeal, cartId }: ProductTablePropsType) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-center w-28">Quantity</TableHead>
          <TableHead className="text-center min-w-24">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const { productId: dealID, discount: deal_discount } = deal || {};
          const { name, slug, image, productId, price } = item;
          const isOrdered = item.dealInfo?.productId === productId;
          const discountCondition = (productId === dealID && isActiveDeal) || item.dealInfo?.productId === productId;
          const discount = isOrdered ? item.dealInfo?.discount : deal_discount;
          const noQty = item.qty === 0;
          return (
            <TableRow key={slug} className={`${noQty && "text-gray-400"}`}>
              {/* image, name */}
              <TableCell className="p-2">
                <Link href={`${PATH.PRODUCT}/${slug}`} className="flex items-center space-x-2">
                  <S3Image
                    folder="product"
                    fileName={image}
                    alt={name}
                    size={PRODUCT_TABLE_IMAGE_SIZE}
                    className={`hidden sm:block ${noQty && "grayscale"}`}
                  />
                  <div>
                    <span className="pr-2" data-testid="product-name">
                      {name}
                    </span>
                    {discountCondition && <DiscountBadge discount={discount || 0} />}
                  </div>
                </Link>
              </TableCell>
              {/* quantity */}
              <TableCell className={cn("h-auto text-center max-w-20")}>
                {noQty ? (
                  <Badge className="bg-gray-400 break-keep">Sold out</Badge>
                ) : (
                  <ItemQtyChanger item={item} isView={isView} size="sm" cartId={cartId} />
                )}
              </TableCell>
              {/* price */}
              <TableCell className="text-center">$ {discountPrice(+price, discount, discountCondition)}</TableCell>
              {!isView && cartId && (
                <TableCell className="p-0">
                  <ItemRemoveButton item={item} cartId={cartId} />
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
