import type { InventoryFormData } from "../../model/schema/inventorySchema";
import type { Inventory } from "../../model/types/inventory.types";
import { defaultInventoryValues } from "../constants/inventoryFormDefault";

export function mapInventoryToForm(
    inventory?: Inventory | null
): InventoryFormData {
    if (!inventory) {
        return defaultInventoryValues;
    }

    return {
        ...defaultInventoryValues,
        product_variant_id: inventory.product_variant_id ?? inventory.product_variant?.id ?? "",
        stock_quantity: inventory.stock_quantity ?? defaultInventoryValues.stock_quantity,
        reserved_quantity: inventory.reserved_quantity ?? defaultInventoryValues.reserved_quantity,
    };
}