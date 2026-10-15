// src/shared/components/DataTable/filters/NumberFilter.tsx
import React from "react";

interface NumberFilterProps {
    placeholder?: string;
    value: string | number | boolean | undefined;
    onChange: (value: number | string) => void;
    parse?: (val: string) => number | string;
}

export const NumberFilter: React.FC<NumberFilterProps> = ({
    placeholder,
    value,
    onChange,
    parse,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const processedValue = parse ? parse(rawValue) : rawValue;
        onChange(processedValue);
    };

    return (
        <div className="relative flex-1 min-w-[120px]">
            <input
                type="number"
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 pe-8 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-all shadow-[var(--shadow-xs)]"
                value={value?.toString() ?? ""}
                onChange={handleChange}
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs pointer-events-none">
                #
            </span>
        </div>
    );
};