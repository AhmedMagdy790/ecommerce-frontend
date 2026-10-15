import { useMemo } from "react";
import { Check, Loader2, Package, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/label";
import { SectionTypes, type SectionType } from "../../model/types/section.types";

export interface SectionSelectOption {
  value: number;
  label: string;
  image?: string;
  price?: string;
}

interface SectionSelectIdsProps {
  type: SectionType;
  options: SectionSelectOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  search: string;
  onSearchChange: (val: string) => void;
}

const CONTENT_LABELS: Partial<Record<SectionType, string>> = {
  [SectionTypes.PRODUCTS]: "sections.content.products",
  [SectionTypes.CATEGORY]: "sections.content.categories",
  [SectionTypes.BRANDS]: "sections.content.brands",
};

export function SectionSelectIdsSelector({
  type,
  options,
  selectedIds,
  onChange,
  error,
  isLoading = false,
  disabled = false,
  search,
  onSearchChange,
}: SectionSelectIdsProps) {
  const { t } = useTranslation();

  const contentLabel = CONTENT_LABELS[type];

  const serverOptions = options;

  const selectedSet = useMemo(
    () => new Set(selectedIds.map(Number)),
    [selectedIds]
  );

  // استخراج العناصر المحددة لعرضها كـ Badges
  const selectedOptions = useMemo(() => {
    return options.filter((opt) => selectedSet.has(opt.value));
  }, [options, selectedSet]);

  const toggleOption = (value: number) => {
    if (disabled) return;

    const nextIds = selectedSet.has(value)
      ? selectedIds.filter((selectedId) => Number(selectedId) !== value)
      : [...selectedIds, value];

    onChange([...new Set(nextIds.map(Number))]);
  };

  const selectAllVisible = () => {
    if (disabled) return;

    const nextIds = new Set(selectedIds.map(Number));
    serverOptions.forEach((option) => nextIds.add(option.value));

    onChange([...nextIds]);
  };

  const clearSelection = () => {
    if (!disabled) onChange([]);
  };

  const allVisibleSelected =
    serverOptions.length > 0 &&
    serverOptions.every((option) => selectedSet.has(option.value));

  if (!contentLabel) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 shadow-sm">
      {/* Header & Title */}
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-semibold tracking-wide">
          {t(contentLabel, "Select content")}
        </Label>

        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {t("sections.selectedCount", {
            count: selectedIds.length,
            defaultValue: `${selectedIds.length} Selected`,
          })}
        </span>
      </div>

      {/* Selected Items Badges List */}
      {selectedOptions.length > 0 && (
        <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto p-1.5 rounded-md bg-muted/40 border border-border/40">
          {selectedOptions.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1.5 rounded-md bg-background border border-border/70 px-2 py-1 text-xs font-medium text-foreground shadow-2xs"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.label}
                  className="size-4 rounded object-cover"
                />
              )}
              <span className="max-w-[150px] truncate">{item.label}</span>
              <button
                type="button"
                onClick={() => toggleOption(item.value)}
                disabled={disabled}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input (Server-Side) */}
      <div className="relative">
        <Search
          size={15}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("common.search", "Search by name...")}
          disabled={disabled}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <button
          type="button"
          onClick={selectAllVisible}
          disabled={
            disabled ||
            isLoading ||
            serverOptions.length === 0 ||
            allVisibleSelected
          }
          className="text-xs font-medium text-primary hover:underline disabled:opacity-40 disabled:no-underline"
        >
          {t("common.selectAll", "Select all visible")}
        </button>

        <button
          type="button"
          onClick={clearSelection}
          disabled={disabled || selectedIds.length === 0}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
        >
          <X size={12} />
          {t("common.clearSelection", "Clear selection")}
        </button>
      </div>

      {/* Content Options Box */}
      <div className="max-h-56 overflow-y-auto rounded-md border border-border/80 bg-background/50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-xs">{t("common.loading", "Loading items...")}</span>
          </div>
        ) : serverOptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 p-8 text-center text-muted-foreground">
            <Package size={22} className="opacity-40" />
            <span className="text-xs font-medium">
              {t("common.noResults", "No items found")}
            </span>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {serverOptions.map((option) => {
              const checked = selectedSet.has(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleOption(option.value)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-start transition-all ${
                    checked
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-muted/50"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  aria-pressed={checked}
                >
                  {/* Custom Checkbox */}
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border transition-all ${
                      checked
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                        : "border-input bg-background"
                    }`}
                  >
                    {checked && <Check size={11} strokeWidth={3} />}
                  </span>

                  {/* Thumbnail Image */}
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="size-7 rounded object-cover border border-border/50 shrink-0"
                    />
                  )}

                  {/* Name */}
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-foreground">
                    {option.label}
                  </span>

                  {/* Price */}
                  {option.price && (
                    <span className="text-[13px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      ${option.price}
                    </span>
                  )}

                  {/* ID */}
                  <span className="font-mono text-[13px] text-muted-foreground/70 bg-muted/60 px-1.5 py-0.5 rounded">
                    #{option.value}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive px-1">{error}</p>
      )}
    </div>
  );
}