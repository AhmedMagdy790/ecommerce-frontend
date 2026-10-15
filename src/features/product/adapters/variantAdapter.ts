import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

export function mapVariant(variant: ProductVariant): ProductVariant {
  return {
    id: variant.id,
    product_id: variant.product_id,
    sku: variant.sku,
    status: variant.status,
    // تحويل السعر إلى رقم أمناً في حال كان قادماً كـ string من الـ API
    price: typeof variant.price === "string" ? parseFloat(variant.price) || 0 : variant.price,
    
    // الاعتماد على inventory للستوك إذا وجد، أو استخدام قيمة افتراضية
    stock: variant.inventory?.stock_quantity ?? 0,

    // التعامل المرن مع الخصائص القادمة من Record<string, string>
    attributes: {
      size: variant.attributes?.size,
      color: variant.attributes?.color,
      // يمكنك إضافة أي خصائص أخرى مرنة هنا إذا أردت
    },
  };
}