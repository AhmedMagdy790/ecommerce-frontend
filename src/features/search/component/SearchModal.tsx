import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

import type { SearchProduct } from "./SearchProductCard";
import type { SearchCategory } from "./SearchCategoryCard";


import {
  fakeProducts,
  fakeCategories,
} from "@/data/search";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({
  open,
  onClose,
}: SearchModalProps) {
  const { t } = useTranslation("common");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setProducts([]);
      setCategories([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setHasSearched(false);
      setProducts([]);
      setCategories([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        // TODO:
        // استبدل هذا بطلب API حقيقي.

        await new Promise((resolve) => setTimeout(resolve, 800));

        setProducts(fakeProducts);
        setCategories(fakeCategories);
        setHasSearched(true);
        // setProducts([]);
        // setCategories([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[var(--z-modal)]
        flex
        items-start
        justify-center
        bg-black/50
        p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          mt-16
          w-full
          max-w-2xl
          rounded-2xl
          bg-[var(--color-background)]
          shadow-xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--color-border)]
            p-4
          "
        >
          <h2 className="text-lg font-semibold">
            {t("search.title")}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              hover:bg-[var(--color-surface)]
            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            autoFocus
          />
        </div>

        <div
          className="
            max-h-[450px]
            overflow-y-auto
            px-4
            pb-4
          "
        >
          <SearchResults
            loading={loading}
             hasSearched={hasSearched}
            query={query}
            products={products}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}