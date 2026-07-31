import { z } from "zod";


export const addressSchema = z.object({
  country_id: z
    .string()
    .min(1, "Country is required"),

  city_id: z
    .string()
    .min(1, "City is required"),

  type: z
    .enum(["home", "work", "other"], {
      errorMap: () => ({ message: "Invalid address type" }),
    })
    .default("home"),

  area: z
    .string()
    .min(2, "Area must be at least 2 characters"),

  street_details: z
    .string()
    .min(5, "Street details must be at least 5 characters"),

  building_number: z
    .string()
    .trim()
    .nullable()
    .optional(),


phone_contact: z
  .string()
  .trim()
  .min(10, "Phone too short")
  .max(15, "Phone too long")
  .regex(/^[0-9+]+$/, "Invalid phone number format"),


    
  is_default: z.boolean().default(false),
});




export type IAddressSchemaInput = z.infer<typeof addressSchema>;




export const updateAddressSchema = z.object({
  country_id: z.string().min(1, "Country is required").optional(),

  city_id: z.string().min(1, "City is required").optional(),

  type: z
    .enum(["home", "work", "other"])
    .optional(),

  area: z
    .string()
    .min(2, "Area must be at least 2 characters")
    .optional(),

  street_details: z
    .string()
    .min(5, "Street details must be at least 5 characters")
    .optional(),

  building_number: z
    .string()
    .trim()
    .nullable()
    .optional(),

  phone_contact: z
    .string()
    .trim()
    .min(10, "Phone too short")
    .max(15, "Phone too long")
    .regex(/^[0-9+]+$/, "Invalid phone number format")
  ,


  is_default: z.boolean().optional(),
});


export type IUpdateAddressSchemaInput = z.infer<typeof updateAddressSchema>;
