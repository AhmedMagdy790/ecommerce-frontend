// src/shared/components/DataTable/filters/SelectFilter.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import CustomSelect, { type Option } from "../../CustomSelect";


interface SelectFilterProps {
    value: string | number | boolean | undefined;
    onChange: (value: unknown) => void;
    options?: Option[];
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
    value,
    onChange,
    options = [],
}) => {
    const { t } = useTranslation("common");

    return (
        <CustomSelect
            searchStatus={true}
            value={value}
            onChange={onChange}
            options={options}
            placeholder={t("all", "All")}
        />
    );
};