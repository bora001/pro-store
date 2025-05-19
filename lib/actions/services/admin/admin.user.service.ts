"use server";

import { prisma } from "@/db/prisma";
import { CONSTANTS } from "@/lib/constants";
import { Prisma } from "@prisma/client";

// get-users
export type HandleGetAllUsersType = { page: number; limit?: number; query: string };
export const handleGetAllUsers = async ({ query, page = 1, limit = CONSTANTS.PAGE_LIMIT }: HandleGetAllUsersType) => {
  const queryFilter: Prisma.UserWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } as Prisma.StringFilter },
          { email: { contains: query, mode: "insensitive" } as Prisma.StringFilter },
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
    data: {
      user,
      userCount,
      totalPages: Math.ceil(userCount / limit),
    },
  };
};
