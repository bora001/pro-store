"use server";

import { prisma } from "@/db/prisma";
import { PATH } from "@/lib/constants";
import { prismaToJs } from "@/lib/utils";
import { revalidatePath } from "next/cache";

//get-setting
export const handleGetSetting = async () => {
  const data = await prisma.setting.findFirst({
    where: { id: 1 },
    include: { tags: true },
  });
  return {
    data: prismaToJs(data),
  };
};

//update-setting
export type HandleUpdateSettingType = Partial<{ [key: string]: string }>;
export const handleUpdateSetting = async (updates: HandleUpdateSettingType) => {
  const data: Partial<{
    [key: string]: string;
  }> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      data[key] = value;
    }
  }
  await prisma.setting.update({
    where: { id: 1 },
    data,
  });
  revalidatePath(PATH.SETTING);
  return {
    message: "Setting updated or created successfully.",
  };
};

// get-tags
export const handleGetTags = async () => {
  const tags = await prisma.setting.findMany({
    where: { id: 1 },
    select: { tags: true },
  });
  return {
    message: "Successfully retrieved tags",
    data: tags,
  };
};

// add-tag
export const handleAddTag = async (name: string) => {
  await prisma.setting.update({
    where: { id: 1 },
    data: {
      tags: {
        create: { name: name.toLowerCase() },
      },
    },
  });
  revalidatePath(PATH.SETTING);
  return {
    message: "Tags updated successfully",
  };
};
// delete-tag
export const handleRemoveTagById = async (id: string) => {
  await prisma.setting.update({
    where: { id: 1 },
    data: {
      tags: {
        delete: {
          id,
        },
      },
    },
  });
  revalidatePath(PATH.SETTING);
  return { message: "Tags deleted successfully" };
};
