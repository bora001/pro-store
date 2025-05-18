"use server";

import { ShippingSchemaType, EditUserSchemaType, SignUpSchemaType, userProfileType } from "@/types";

import { handleAsync } from "@/utils/handle-async";
import {
  handleSignInUser,
  handleCheckDuplicateEmail,
  handleDeleteUser,
  handleDeleteUserAccount,
  handleEditUserProfile,
  handleGetUserById,
  handleSignOutUser,
  handleSignUpUser,
  handleUpdateUserAddress,
  handleUpdateUserProfile,
} from "../services/user.service";

// sign-up
export async function signUpUser(user: SignUpSchemaType) {
  return handleAsync(() => handleSignUpUser(user));
}
// no handleAsync // sign-in
export async function signInUser(prevState: unknown, data: FormData) {
  return handleSignInUser(prevState, data);
}
// sign-out
export async function signOutUser() {
  return handleAsync(() => handleSignOutUser());
}
// check-duplicate-email
export async function checkDuplicateEmail(email: string) {
  return handleAsync(() => handleCheckDuplicateEmail(email));
}
// get-user
export async function getUserById(id: string) {
  return handleAsync(() => handleGetUserById(id));
}
// update-address
export async function updateUserAddress(data: ShippingSchemaType) {
  return handleAsync(() => handleUpdateUserAddress(data));
}
// update-user-profile
export async function updateUserProfile(data: userProfileType) {
  return handleAsync(() => handleUpdateUserProfile(data));
}
// edit-user-profile-by-admin
export async function editUserProfile(data: EditUserSchemaType) {
  return handleAsync(() => handleEditUserProfile(data));
}
// delete-user
export async function deleteUser(id: string) {
  return handleAsync(() => handleDeleteUser(id));
}
// delete-user-account
export async function deleteUserAccount(id: string) {
  return handleAsync(() => handleDeleteUserAccount(id));
}
