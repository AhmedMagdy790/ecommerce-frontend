import type { variantFormData } from "../../model/schema/variantSchema";

export const defaultProductVariantValues: variantFormData = {
  id: undefined,
  sku: "",
  price: 0,
  stock: 0,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  status: "active",
  attributes: [],
};