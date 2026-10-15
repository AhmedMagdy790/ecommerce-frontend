import { useTranslation } from "react-i18next";
import { Label } from "@/shared/components/ui/label";
import { useProductOptions } from "@/features/product/dashboard/hook/useProductOptions";


interface SectionProductsSelectorProps {
  selectedIds: (number | string)[];
  onChange: (ids: (number | string)[]) => void;
  error?: string;
}

export function SectionProductsSelector({
  selectedIds = [],
  onChange,
  error,
}: SectionProductsSelectorProps) {
  const { t } = useTranslation();
  const { productOptions, isProductsLoading } = useProductOptions();

  const handleCheckboxChange = (id: number | string, checked: boolean) => {
    const currentIds = Array.isArray(selectedIds) ? selectedIds : [];
    const newIds = checked
      ? [...currentIds, id]
      : currentIds.filter((item) => item !== id);

    onChange(newIds);
  };

  return (
    <div className="flex flex-col gap-2 w-full pt-2 border-t border-[var(--color-border)]">
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-sm">
          {t("sections.selectProducts", "Select Products (Manual)")}
        </Label>
        <span className="text-xs text-muted-foreground">
          {selectedIds.length} {t("common.selected", "selected")}
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground">
        {t(
          "sections.selectProductsHint",
          "اختر المنتجات المراد عرضها يدوياً في هذا القسم. إذا تركتها فارغة، سيتم جلبها تلقائياً."
        )}
      </p>

      {isProductsLoading ? (
        <div className="text-xs text-muted-foreground py-4 text-center">
          {t("common.loading", "Loading products...")}
        </div>
      ) : productOptions.length === 0 ? (
        <div className="text-xs text-muted-foreground py-4 text-center border rounded-md">
          {t("sections.noProductsFound", "No products available")}
        </div>
      ) : (
        <div className="max-h-56 overflow-y-auto border rounded-md p-3 space-y-2 bg-background">
          {productOptions.map((option) => {
            const isSelected = selectedIds.includes(option.value);

            return (
              <label
                key={option.value}
                className={`flex items-center justify-between gap-3 p-2 rounded-md cursor-pointer text-sm transition-colors border ${
                  isSelected 
                    ? "bg-primary/5 border-primary/30" 
                    : "hover:bg-muted/50 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                    className="rounded border-input w-4 h-4 text-primary focus:ring-primary"
                  />
                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-9 h-9 object-cover rounded-md border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.price} {t("common.currency", "EGP")}
                      {option.variantsCount > 0 && ` • (${option.variantsCount} variants)`}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {error && (
        <span className="text-xs text-[var(--color-error)] font-medium px-1">
          {error}
        </span>
      )}
    </div>
  );
}