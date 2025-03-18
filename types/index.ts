import { insertProductSchema } from "@/lib/validator";
import { z } from "zod";

export type ProductItem = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
