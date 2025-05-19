"use server";

import { handleAsync } from "@/utils/handle-async";
import { HandleGetAllUsersType, handleGetAllUsers } from "../../services/admin/admin.user.service";

// get-users
export async function getAllUsers(queries: HandleGetAllUsersType) {
  return handleAsync(() => handleGetAllUsers(queries));
}
