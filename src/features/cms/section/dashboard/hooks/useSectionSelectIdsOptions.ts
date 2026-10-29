
import { useMemo, useState, useCallback } from "react";

import {
    SectionTypes,
    type SectionType,
} from "../../model/types/section.types";

import { useProductOptions } from "@/features/product/dashboard/hook/useProductOptions";
import { useCategoryOptions } from "@/features/category/dashboard/hook/useCategoryOptions";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function useSectionContentOptions(type: SectionType) {
    const [searchState, setSearchState] = useState({
        type,
        value: "",
    });

    const search = searchState.type === type ? searchState.value : "";
    const debouncedSearch = useDebounce(search, 400);

    const isProducts = type === SectionTypes.PRODUCTS;
    const isCategory = type === SectionTypes.CATEGORY;

    const { productOptions, isProductsLoading } = useProductOptions(
        debouncedSearch,
        { enabled: isProducts },
    );

    const { categoryOptions, isCategoriesLoading } = useCategoryOptions(
        debouncedSearch,
        { enabled: isCategory },
    );

    const setSearch = useCallback(
        (value: string) => {
            setSearchState({ type, value });
        },
        [type],
    );

    const { contentOptions, isContentLoading } = useMemo(() => {
        if (isProducts) {
            return {
                contentOptions: productOptions,
                isContentLoading: isProductsLoading,
            };
        }

        if (isCategory) {
            return {
                contentOptions: categoryOptions,
                isContentLoading: isCategoriesLoading,
            };
        }

        return {
            contentOptions: [],
            isContentLoading: false,
        };
    }, [
        isProducts,
        isCategory,
        productOptions,
        categoryOptions,
        isProductsLoading,
        isCategoriesLoading,
    ]);

    return {
        contentOptions,
        isContentLoading,
        hasContentPicker: isProducts || isCategory,
        search,
        setSearch,
    };
}