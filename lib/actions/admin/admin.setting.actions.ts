"use server";

import { prisma } from "@/db/prisma";
import { PATH } from "@/lib/constants";
import { formatError, formatSuccess, prismaToJs } from "@/lib/utils";
import { revalidatePath } from "next/cache";

//get-setting
export async function getSetting() {
  try {
    const data = await prisma.setting.findFirst({
      where: { id: 1 },
      include: { tags: true },
    });
    return {
      success: true,
      data: prismaToJs(data),
    };
  } catch (error) {
    return formatError(error);
  }
}

//update-setting
export async function updateSetting(
  updates: Partial<{ [key: string]: string }>
) {
  try {
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
    return formatSuccess("Setting updated or created successfully.");
  } catch (error) {
    return formatError(error);
  }
}

// get-tags
export async function getTags() {
  try {
    const tags = await prisma.setting.findMany({
      where: { id: 1 },
      select: { tags: true },
    });
    return {
      success: true,
      message: "Successfully retrieved tags",
      data: tags,
    };
  } catch (error) {
    return formatError(error);
  }
}

// add-tag
export async function addTag(name: string) {
  try {
    await prisma.setting.update({
      where: { id: 1 },
      data: {
        tags: {
          create: { name: name.toLowerCase() },
        },
      },
    });
    revalidatePath(PATH.SETTING);
    return formatSuccess("Tags updated successfully");
  } catch (error) {
    return formatError(error);
  }
}
// delete-tag
export async function removeTagById(id: string) {
  try {
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
    return formatSuccess("Tags deleted successfully");
  } catch (error) {
    return formatError(error);
  }
}
