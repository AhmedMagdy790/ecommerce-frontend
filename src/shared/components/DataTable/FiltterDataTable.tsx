// src/shared/components/DataTable/FiltterDataTable.tsx
import { X } from "lucide-react";
import React, { useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DataTableSearch } from "./filters/DataTableSearch";
import { TextFilter } from "./filters/TextFilter";
import { NumberFilter } from "./filters/NumberFilter";
import { DateFilter } from "./filters/DateFilter";
import { SelectFilter } from "./filters/SelectFilter";
import type { Option } from "../CustomSelect";

export type FilterType = "text" | "select" | "date" | "number";

export type FilterOperator = "contains" | "equals";

export interface FilterField<T extends object> {
  key: keyof T;
  label: string;
  type: FilterType;
  operator?: FilterOperator;
  placeholder?: string;
  options?: Option[];
    parse?: (value: string) => string | number;
  render?: (
    value: T[keyof T],
    onChange: (value: unknown) => void
  ) => ReactNode;
}

interface Props<T extends Record<string, unknown>> {
    filterFields?: FilterField<T>[];
    filters: Partial<T>;
    setFilters: React.Dispatch<React.SetStateAction<Partial<T>>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    showSearch?: boolean;
}

export default function FilterDataTable<T extends Record<string, unknown>>({
    filterFields = [],
    filters = {},
    setFilters,
    searchTerm = "",
    setSearchTerm,
    showSearch = true,
}: Props<T>) {
    const { t } = useTranslation("common");

    const handleFilterChange = useCallback((key: keyof T, value: unknown) => {

        setFilters((prev) => ({
            ...prev,
            [key]: value === "" ? undefined : value,
        }));
    }, [setFilters]);

    const hasActiveFilters = Object.values(filters).some(
        (val) => val !== "" && val !== null && val !== undefined
    );

    const clearAllFilters = useCallback(() => {
        setFilters({});
        setSearchTerm("");
    }, [setFilters, setSearchTerm]);

    if (filterFields.length === 0 && !showSearch) return null;

    return (
        <div 
            className="
                flex 
                flex-col
                gap-4 
                p-5 
                bg-[var(--card-bg)] 
                border 
                border-[var(--color-border)] 
                rounded-[var(--radius-xl)] 
                shadow-[var(--shadow-xs)]
                backdrop-blur-xl relative z-[99]
            "
        >
            {/* Search Bar & Reset Actions */}
            <div className="flex items-center gap-3 w-full">
                {showSearch && (
                    <div className="flex-1">
                        <DataTableSearch
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </div>
                )}

                {(hasActiveFilters || searchTerm) && (
                    <button
                        type="button"
                        onClick={clearAllFilters}
                        className="
                            flex 
                            items-center 
                            gap-1.5 
                            px-3.5 
                            py-2.5 
                            text-xs 
                            font-semibold
                            rounded-[var(--radius-md)]
                            border 
                            border-[var(--color-border)] 
                            bg-[var(--color-background)] 
                            text-[var(--color-text-secondary)] 
                            hover:bg-[var(--color-surface-secondary)]
                            transition-colors
                            shrink-0
                        "
                        title={t("clear_filters", "Clear Filters")}
                    >
                        <X className="w-4 h-4" />
                        <span>{t("clear", "Clear")}</span>
                    </button>
                )}
            </div>

            {/* Dynamic Filter Fields */}
            {filterFields.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full pt-1">
                    {filterFields.map((field) => {
                        const fieldValue = filters[field.key] as string | number | boolean | undefined;

                        if (field.render) {
                            return (
                                <React.Fragment key={String(field.key)}>
                                    {field.render(filters[field.key] as T[keyof T], (val) => 
                                        handleFilterChange(field.key, val)
                                    )}
                                </React.Fragment>
                            );
                        }

                        return (
                            <div key={String(field.key)} className="flex flex-col gap-1.5">
                                {field.label && (
                                    <label className="text-xs font-medium text-[var(--color-text-muted)]">
                                        {field.label}
                                    </label>
                                )}
                                {(() => {
                                    switch (field.type) {
                                        case "text":
                                            return (
                                                <TextFilter
                                                    placeholder={field.placeholder || field.label}
                                                    value={fieldValue}
                                                    onChange={(val) => handleFilterChange(field.key, val)}
                                                />
                                            );
                                        case "number":
                                            return (
                                                <NumberFilter
                                                    placeholder={field.placeholder || field.label}
                                                    value={fieldValue}
                                                    onChange={(val) => handleFilterChange(field.key, val)}
                                                    parse={field.parse}
                                                />
                                            );
                                        case "date":
                                            return (
                                                <DateFilter
                                                    placeholder={field.placeholder || field.label}
                                                    value={fieldValue}
                                                    onChange={(val) => handleFilterChange(field.key, val)}
                                                />
                                            );
                                        case "select":
                                            return (
                                                <SelectFilter
                                                    value={fieldValue}
                                                    onChange={(val) => handleFilterChange(field.key, val)}
                                                    options={field.options}
                                                />
                                            );
                                        default:
                                            return null;
                                    }
                                })()}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}