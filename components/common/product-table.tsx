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
import Image from "next/image";
import { OrderItem } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ProductTable = ({
  items,
  isView,
}: {
  items: OrderItem[];
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
                href={`/product/${item.slug}`}
                className="flex items-center"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
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
