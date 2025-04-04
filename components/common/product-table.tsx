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
import { OrderItemType } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PATH } from "@/lib/constants";
import S3Image from "./S3Image";

const PRODUCT_TABLE_IMAGE_SIZE = 50;

const ProductTable = ({
  items,
  isView,
}: {
  items: OrderItemType[];
  isView?: boolean;
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
        {items.map((item) => (
          <TableRow key={item.slug}>
            {/* image, name */}
            <TableCell>
              <Link
                href={`${PATH.PRODUCT}/${item.slug}`}
                className="flex items-center"
              >
                <S3Image
                  folder="product"
                  fileName={item.image}
                  alt={item.name}
                  size={PRODUCT_TABLE_IMAGE_SIZE}
                />
                <span className="px-2">{item.name}</span>
              </Link>
            </TableCell>
            {/* quantity */}
            <TableCell
              className={cn(" gap-2", isView ? "text-center" : "flex-center")}
            >
              <ItemQtyChanger item={item} isView={isView} />
            </TableCell>
            {/* price */}
            <TableCell className="text-center">$ {item.price}</TableCell>
            {!isView && (
              <TableCell>
                <ItemRemoveButton item={item} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
