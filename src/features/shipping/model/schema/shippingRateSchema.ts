// src/features/shipping/model/schema/shippingRateSchema.ts

import { z } from "zod";

export const shippingRateSchema = z.object({
  city_id: z.number({
    error: "validation.required",
  }).min(1, "validation.required"),

  shipping_courier_id: z.number({
    error: "validation.required",
  }).min(1, "validation.required"),

  shipping_fee: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  estimated_delivery_from: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  estimated_delivery_to: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  cod_fee: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  base_cost: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  base_weight: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  extra_per_kg: z.number({
    error: (issue) => issue.input === undefined
      ? "validation.required"
      : "validation.number",
  }).min(0, "validation.min_zero"),

  // الحقول الاختيارية (تسمح بالـ null أو الأرقام الموجبة)
  max_weight: z.union([
    z.number().min(0, "validation.min_zero"),
    z.null()
  ]).optional(),

  free_shipping_threshold: z.union([
    z.number().min(0, "validation.min_zero"),
    z.null()
  ]).optional(),

  is_active: z.boolean(),
});

// استخراج أنواع البيانات للفورم والـ Data Transfer
export type ShippingRateFormData = z.infer<typeof shippingRateSchema>;
export type ShippingRateFormInput = z.input<typeof shippingRateSchema>;