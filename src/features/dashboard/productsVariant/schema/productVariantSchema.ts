import { z } from "zod";

export const productVariantSchema = z.object({


    product_id: z.number().nullable(), 

    sku: z
        .string()
        .min(2, "SKU must be at least 2 characters")
        .max(100, "SKU is too long"),

    attributes: z.record(z.string()).optional(),


    price: z
        .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        })
        .min(0, "Price cannot be negative"),


    stock: z
        .number({
            required_error: "Stock is required",
            invalid_type_error: "Stock must be a number",
        })
        .int("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .default(0),

    weight: z
        .number({
            required_error: "الوزن مطلوب",
            invalid_type_error: "الوزن يجب أن يكون رقماً",
        })
        .min(0, "الوزن لا يمكن أن يكون سالباً")
        .default(0),
    length: z
        .number({
            required_error: "الطول مطلوب",
            invalid_type_error: "الطول يجب أن يكون رقماً",
        })
        .min(0, "الطول لا يمكن أن يكون سالباً")
        .default(0),
    width: z
        .number({
            required_error: "العرض مطلوب",
            invalid_type_error: "العرض يجب أن يكون رقماً",
        })
        .min(0, "العرض لا يمكن أن يكون سالباً")
        .default(0),
    height: z
        .number({
            required_error: "الارتفاع مطلوب",
            invalid_type_error: "الارتفاع يجب أن يكون رقماً",
        })
        .min(0, "الارتفاع لا يمكن أن يكون سالباً")
        .default(0),

    status: z.enum(["active", "inactive", "archived"]).default("active"),
});


export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
