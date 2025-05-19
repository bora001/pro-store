"use server";

import { handleAsync } from "@/utils/handle-async";
import {
  HandleUpdateSettingType,
  handleAddTag,
  handleGetSetting,
  handleGetTags,
  handleRemoveTagById,
  handleUpdateSetting,
} from "../../services/admin/admin.setting.service";

//get-setting
export async function getSetting() {
  return handleAsync(() => handleGetSetting());
}
//update-setting
export async function updateSetting(data: HandleUpdateSettingType) {
  return handleAsync(() => handleUpdateSetting(data));
}
// get-tags
export async function getTags() {
  return handleAsync(() => handleGetTags());
}
// add-tag
export async function addTag(name: string) {
  return handleAsync(() => handleAddTag(name));
}
// delete-tag
export async function removeTagById(id: string) {
  return handleAsync(() => handleRemoveTagById(id));
}
