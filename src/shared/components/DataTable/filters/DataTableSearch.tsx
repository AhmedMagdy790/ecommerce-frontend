// src/shared/components/DataTable/filters/DataTableSearch.tsx
import { Search } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface DataTableSearchProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const DataTableSearch: React.FC<DataTableSearchProps> = ({
    searchTerm,
    setSearchTerm,
}) => {
    const { t } = useTranslation("common");

    return (
        <div className="relative flex-1">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
            <input
                type="text"
                value={searchTerm}
                placeholder={t("search_placeholder", "Search anything...")}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2.5 ps-11 pe-4 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-all shadow-[var(--shadow-xs)]"
            />
        </div>
    );
};