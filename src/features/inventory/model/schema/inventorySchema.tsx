import { z } from "zod";

export const inventorySchema = z.object({
  product_variant_id: z
    .number({ message: "Product variant is required" })
    .int()
    .positive("Product variant is required"),
  
  stock_quantity: z
    .number({ message: "Stock quantity must be a number" })
    .int()
    .min(0, "Stock quantity cannot be negative"),
  
  reserved_quantity: z
    .number({ message: "Reserved quantity must be a number" })
    .int()
    .min(0, "Reserved quantity cannot be negative"),
});

export type InventoryFormInput = z.input<typeof inventorySchema>;
export type InventoryFormData = z.output<typeof inventorySchema>;