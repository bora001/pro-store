"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS } from "@/lib/constants";
import { Prisma } from "@prisma/client";

// get-users
export async function getAllUsers({
  query,
  // category,
  page = 1,
  limit = CONSTANTS.PAGE_LIMIT,
}: {
  page: number;
  limit?: number;
  query: string;
  category?: string;
}) {
  const queryFilter: Prisma.UserWhereInput = query
    ? {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        ],
      }
    : {};

  const user = await prisma.user.findMany({
    where: { ...queryFilter },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  const userCount = await prisma.user.count();
  return {
    user,
    userCount,
    totalPages: Math.ceil(userCount / limit),
  };
}
