import { useRef, useMemo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Layers, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import type { IModal } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { getLocalizedName } from "@/shared/utils/localizeName";

import type { Inventory } from "../../../model/types/inventory.types";
import { useProductVariantStore } from "@/features/product-variants/model/store/useProductVariantStore"; 
import { useInventoryForm } from "../../hooks/useInventoryForm";
import { ActionButtons } from "@/shared/components/ActionButtons";

interface IInventoryModal extends IModal {
  inventory?: Inventory | null;
}

export default function InventoryModal({ isOpen, closeModal, inventory }: IInventoryModal) {
  const {  i18n, t } = useTranslation("inventory");
  const currentAppLang = i18n.language;
  const formRef = useRef<HTMLFormElement>(null);


  // Fetch product variants using your store
  const { items: variants, fetch: fetchVariants } = useProductVariantStore();

  // جلب البيانات تلقائياً عند فتح الـ Modal
  useEffect(() => {
    if (isOpen) {
      fetchVariants();
    }
  }, [isOpen, fetchVariants]);


  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useInventoryForm(inventory, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  // Map variants to CustomSelect options format
  const variantOptions = useMemo(() => {
    const options = (variants || []).map((v) => {
      const productName = getLocalizedName(v.product?.name ?? "", currentAppLang);
      return {
        label: `${productName || "Product"} — SKU: ${v.sku}`,
        value: String(v.id),
      };
    });

    return [
      { label: t("inventory.selectVariant", "Select Product Variant..."), value: "" },
      ...options,
    ];
  }, [variants, currentAppLang, t]);

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      action={
        <ActionButtons
          closeModal={closeModal}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          formRef={formRef}
          t={t}
        />
      }
      title={
        isEditMode
          ? t("inventory.editInventory", "Edit Inventory Item")
          : t("inventory.addNewInventory", "Add New Inventory Item")
      }
      description={t("inventory.modalDescription", "Enter inventory quantities and details")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          {/* Product Variant Selection */}
          <Controller
            name="product_variant_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("inventory.productVariant", "Product Variant")}
                disabled={isSubmitting || isEditMode}
                placeholder={t("inventory.selectVariantPlaceholder", "Select variant...")}
                options={variantOptions}
                value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                onChange={(val) => field.onChange(val ? Number(val) : "")}
                error={errors.product_variant_id?.message}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label={t("inventory.stockQuantity", "Stock Quantity")}
              placeholder="0"
              error={errors.stock_quantity?.message}
              icon={<Package size={16} />}
              {...register("stock_quantity", { valueAsNumber: true })}
            />

            <Input
              type="number"
              label={t("inventory.reservedQuantity", "Reserved Quantity")}
              placeholder="0"
              error={errors.reserved_quantity?.message}
              icon={<Layers size={16} />}
              {...register("reserved_quantity", { valueAsNumber: true })}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}