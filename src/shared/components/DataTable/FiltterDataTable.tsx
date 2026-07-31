import { Search, X } from "lucide-react";
import React from "react";
import CustomSelect from "../CustomSelect";

export interface FilterField {
    key: string;
    label: string;
    type: "text" | "select" | "date" | "number";
    placeholder?: string;
    options?: { label: string; value: any }[];
}

interface Props {
    filterFields: FilterField[];
    filters: Record<string, any>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    lang?: "ar" | "en";
}

// Shared style for standard inputs to keep code DRY and maintainable
const inputBaseStyles = `
    w-full
    px-3.5
    py-2.5
    text-sm
    rounded-[var(--radius-md)]
    border
    border-[var(--color-border)]
    bg-[var(--color-background)]
    text-[var(--color-text-primary)]
    placeholder-[var(--color-text-muted)]
    focus:outline-none
    focus:border-[var(--color-primary)]
    transition-all
    duration-[var(--duration-fast)]
    shadow-[var(--shadow-xs)]
`;

const FilterDataTable: React.FC<Props> = ({
    filterFields = [],
    filters = {},
    setFilters,
    searchTerm = "",
    setSearchTerm,
    lang = "en",
}) => {
    if (filterFields.length === 0 && !searchTerm) return null;

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const hasActiveFilters = Object.values(filters).some(
        (val) => val !== "" && val !== null && val !== undefined
    );

    const clearAllFilters = () => {
        setFilters({});
        setSearchTerm("");
    };

    return (
        <div 
            className="
                flex 
                flex-wrap 
                gap-4 
                p-5 
                mt-5 
                bg-[var(--card-bg)] 
                border 
                border-[var(--color-border)] 
                rounded-[var(--radius-xl)] 
                shadow-[var(--shadow-xs)]
                backdrop-blur-xl
            "
        >
            {/* Search Bar & Reset Actions */}
            <div className="flex items-center gap-3 w-full">
                <div className="relative flex-1">
                    <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder={lang === "ar" ? "بحث عن أي شيء..." : "Search anything..."}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${inputBaseStyles} ps-11 pe-4`}
                    />
                </div>

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
                        "
                        title={lang === "ar" ? "مسح الفلاتر" : "Clear Filters"}
                    >
                        <X className="w-4 h-4" />
                        <span>{lang === "ar" ? "مسح" : "Clear"}</span>
                    </button>
                )}
            </div>

            {/* Dynamic Filter Fields */}
            {filterFields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                    {filterFields.map((field) => {
                        const fieldValue = filters[field.key] ?? "";

                        switch (field.type) {
                            case "text":
                                return (
                                    <div key={field.key} className="relative flex-1 min-w-[120px]">
                                        <input
                                            type="text"
                                            placeholder={field.placeholder || field.label}
                                            className={`${inputBaseStyles} pe-8`}
                                            value={fieldValue}
                                            onChange={(e) => handleFilterChange(field.key, e.target.value)}
                                        />
                                        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs pointer-events-none">
                                            #
                                        </span>
                                    </div>
                                );
                            case "number":
                                return (
                                    <div key={field.key} className="relative flex-1 min-w-[120px]">
                                        <input
                                            type="number"
                                            placeholder={field.placeholder || field.label}
                                            className={`${inputBaseStyles} pe-8`}
                                            value={fieldValue}
                                            onChange={(e) => handleFilterChange(field.key, e.target.value)}
                                        />
                                        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs pointer-events-none">
                                            #
                                        </span>
                                    </div>
                                );
                            case "date":
                                return (
                                    <input
                                        key={field.key}
                                        type={field.type}
                                        placeholder={field.placeholder || field.label}
                                        className={inputBaseStyles}
                                        value={fieldValue}
                                        onChange={(e) => handleFilterChange(field.key, e.target.value)}
                                    />
                                );

                            case "select":
                                return (
                                    <CustomSelect
                                        key={field.key}
                                        searchStatus={false}
                                        value={fieldValue}
                                        onChange={(val) => handleFilterChange(field.key, val)}
                                        options={field.options || []}
                                        placeholder={lang === "ar" ? "الكل" : "All"}
                                    />
                                );

                            default:
                                return null;
                        }
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterDataTable;