import { useEffect, useMemo } from "react";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useProductStore } from "../../model/store/useProductStore";

interface UseProductOptionsConfig {
  enabled?: boolean;
}

export function useProductOptions(
  initialSearch = "",
  { enabled = true }: UseProductOptionsConfig = {}
) {
  const { lang } = useLang();

  const {
    items: products,
    fetch: fetchProducts,
    isFetching,
  } = useProductStore();

  useEffect(() => {
    if (!enabled) return;

    fetchProducts({
      search: initialSearch?.trim() || undefined,
    });
  }, [enabled, initialSearch, fetchProducts]);

  const productOptions = useMemo(() => {
    if (!enabled) return [];

    return (products || []).map((product) => {
      const localizedName = getLocalizedName(product.name, lang);

      const rawPrice =
        product.price ??
        product.starting_at ??
        (Array.isArray(product.variants) ? product.variants?.[0]?.price : 0);

      const thumbnail =
        (typeof product.featured_image === "string"
          ? product.featured_image
          : product.featured_image?.url) ??
        product.thumbnail ??
        "/images/placeholders/product.webp";

      return {
        label: localizedName,
        value: product.id,
        price: rawPrice,
        image: thumbnail,
        variantsCount: Array.isArray(product.variants)
          ? product.variants.length
          : 0,
        raw: product,
      };
    });
  }, [enabled, products, lang]);

  return {
    productOptions,
    isProductsLoading: enabled && isFetching,
  };
}