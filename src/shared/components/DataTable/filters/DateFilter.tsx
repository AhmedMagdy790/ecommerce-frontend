// src/shared/components/DataTable/filters/DateFilter.tsx
import React from "react";

interface DateFilterProps {
    placeholder?: string;
    value: string | number | boolean | undefined;
    onChange: (value: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
    placeholder,
    value,
    onChange,
}) => {
    return (
        <input
            type="date"
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-all shadow-[var(--shadow-xs)]"
            value={value?.toString() ?? ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};