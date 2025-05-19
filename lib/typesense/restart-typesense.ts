import { TYPESENSE_KEY } from "../constants";
import { checkSetupTypesense } from "./check-setup";

export async function restartTypeSense() {
  return await Promise.all(Object.values(TYPESENSE_KEY).map((key) => checkSetupTypesense(key)));
}
