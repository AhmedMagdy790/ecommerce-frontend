// src/features/product/dashboard/constants/productFilters.ts
import { type TFunction } from "i18next";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { Product } from "../../model/types/product.types";
import type { TranslatedText } from "@/shared/types/types";

export const getProductFilters = (t: TFunction): FilterField<Product<TranslatedText>>[] => [
    {
        key: "name",
        label: t("filters.name"),
        type: "text",
        placeholder: t("filters.search_placeholder"),
    },
    {
        key: "brand",
        label: t("filters.brand"),
        type: "text",
        placeholder: "Apple...",
    },
    {
        key: "price",
        label: t("filters.min_price"),
        type: "text",
        placeholder: "",
    },
    {
        key: "status",
        label: t("filters.status"),
        type: "select",
        options: [
            { label: t("status.all"), value: null },
            { label: t("status.active"), value: "active" },
            { label: t("status.archived"), value: "archived" },
            { label: t("status.draft"), value: "draft" },
        ],
    },
];