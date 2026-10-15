import { useEffect, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { useCategoryStore } from "@/features/category/model/store/useCategoryStore";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { ProductFormData } from "@/features/product/model/schema/productSchema";
import { getTranslatedError } from "@/shared/utils/helper";

const statusOptions = [
  { label: "🟢 Active", value: "active" },
  { label: "📦 Archived", value: "archived" },
  { label: "📝 Draft", value: "draft" },
];

interface BasicInfoStepProps {
  activeLang: string;
  isUpdate?: boolean;
}

export default function BasicInfoStep({ activeLang }: BasicInfoStepProps) {
  const { t } = useTranslation("product");
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { items: adminCategories, fetch } = useCategoryStore();

  useEffect(() => {
    fetch();
  }, [fetch]);


  const fields = useMemo(() => ({
    name: `name.${activeLang}` as const,
    description: `description.${activeLang}` as const,
  }), [activeLang]);


  const labels = useMemo(() => ({
    sectionTitle: t("modal.basic.section_title", "بيانات المنتج الأساسية"),
    nameLabel: t(`modal.basic.name_${activeLang}`),
    namePlaceholder: t(`modal.basic.name_placeholder_${activeLang}`),
    brandLabel: t("modal.basic.brand", "الماركة (Brand)"),
    categoryLabel: t("modal.basic.category", "القسم (Category)"),
    statusLabel: t("modal.basic.status", "حالة النشر"),
    descLabel: t(`modal.basic.desc_${activeLang}`),
    descPlaceholder: t(`modal.basic.desc_placeholder_${activeLang}`),
  }), [t, activeLang]);

  const categoryOptions = useMemo(() => {
    return (adminCategories || []).map((cat) => ({
      label: getLocalizedName(cat.name, activeLang),
      value: cat.id.toString(),
    }));
  }, [adminCategories, activeLang]);

  return (
    <>
      <Input
        label={labels.nameLabel}
        placeholder={labels.namePlaceholder}
        error={getTranslatedError<ProductFormData>(errors.name, activeLang)}
        icon={<Package size={18} />}
        {...register(fields.name)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <Controller
          name="brand_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label={labels.brandLabel}
              options={[]}
              value={field.value?.toString() || ""}
              onChange={field.onChange}
              error={getTranslatedError<ProductFormData>(errors.brand_id, activeLang)}
            />
          )}
        />

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label={labels.categoryLabel}
              options={categoryOptions}
              value={field.value?.toString() || ""}
              onChange={field.onChange}
              error={getTranslatedError<ProductFormData>(errors.category_id, activeLang)}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 mb-2">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label={labels.statusLabel}
              options={statusOptions}
              value={field.value}
              onChange={field.onChange}
              error={getTranslatedError<ProductFormData>(errors.status, activeLang)}
            />
          )}
        />
      </div>

      <Textarea
        label={labels.descLabel}
        placeholder={labels.descPlaceholder}
        error={getTranslatedError<ProductFormData>(errors.description, activeLang)}
        {...register(fields.description)}
      />
    </>
  );
}