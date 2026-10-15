import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface WishlistItemProps {
  data: {
    id: string;
    slug?: string;
    name: string;
    image: string;
    price: number;
    oldPrice?: number;
    stock: boolean;
  };

  onRemove?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export default function WishlistItem({
  data,
  onRemove,
  onAddToCart,
}: WishlistItemProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  const discountPercentage = data.oldPrice 
    ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100) 
    : 0;

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className="group relative overflow-hidden transition-all duration-normal border hover:shadow-lg"
      style={{
        borderRadius: "var(--radius-2xl)",
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Top Badges (Stock & Discount) */}
      <div 
        className="absolute top-3 z-10 flex flex-col gap-1"
        style={{
          [isRTL ? "right" : "left"]: "12px",
        }}
      >
        {discountPercentage > 0 && (
          <span
            style={{
              paddingTop: "var(--spacing-1)",
              paddingBottom: "var(--spacing-1)",
              paddingLeft: "var(--spacing-2.5)",
              paddingRight: "var(--spacing-2.5)",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--red-500)",
              color: "var(--color-text-inverse)",
              fontSize: "11px",
              fontWeight: "var(--font-semibold)",
              fontFamily: "var(--font-sans)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Remove Button Quick Action (Top Corner) */}
      <button
        onClick={() => onRemove?.(data.id)}
        aria-label={t("remove", { defaultValue: "Remove" })}
        className="absolute top-3 z-10 flex items-center justify-center transition-all duration-fast hover:scale-110 active:scale-95"
        style={{
          [isRTL ? "left" : "right"]: "12px",
          height: "32px",
          width: "32px",
          borderRadius: "var(--radius-full)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-error)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <Trash2 size={15} strokeWidth={2} />
      </button>

      {/* Image Container */}
      <Link
        to={`/products/${data.slug || data.id}`}
        className="block relative aspect-square overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-secondary)" }}
      >
        <img
          src={data.image}
          alt={t(data.name)}
          className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay subtle hover gradient */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-normal group-hover:opacity-100 pointer-events-none" />
      </Link>

      {/* Content */}
      <div
        style={{
          padding: "var(--spacing-5)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-3)",
        }}
      >
        {/* Title */}
        <Link
          to={`/products/${data.slug || data.id}`}
          className="transition-colors hover:text-[var(--color-primary)]"
        >
          <h3
            className="line-clamp-1"
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-primary)",
            }}
          >
            {t(data.name)}
          </h3>
        </Link>

        {/* Stock Indicator */}
        <div className="flex items-center" style={{ gap: "var(--spacing-1.5)" }}>
          {data.stock ? (
            <>
              <CheckCircle2 size={14} style={{ color: "var(--color-success)" }} />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
                  color: "var(--color-success)",
                  fontWeight: "var(--font-medium)",
                }}
              >
                {lang === "ar" ? "متوفر في المخزون" : "In Stock"}
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={14} style={{ color: "var(--color-error)" }} />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
                  color: "var(--color-error)",
                  fontWeight: "var(--font-medium)",
                }}
              >
                {lang === "ar" ? "غير متوفر حالياً" : "Out of Stock"}
              </span>
            </>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center" style={{ gap: "var(--spacing-3)" }}>
          <span
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: "var(--font-bold)",
              fontFamily: "var(--font-sans)",
              color: "var(--color-primary)",
            }}
          >
            ${data.price.toFixed(2)}
          </span>

          {data.oldPrice && (
            <span
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                color: "var(--color-text-muted)",
                textDecoration: "line-through",
              }}
            >
              ${data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions Button */}
        <div style={{ paddingTop: "var(--spacing-1)" }}>
          <button
            disabled={!data.stock}
            onClick={() => onAddToCart?.(data.id)}
            className="w-full flex items-center justify-center transition-all duration-fast hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            style={{
              height: "42px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-semibold)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              gap: "var(--spacing-2)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <ShoppingBag size={16} strokeWidth={2.2} />
            <span>{t("addToCart", { defaultValue: "Add to Cart" })}</span>
          </button>
        </div>
      </div>
    </article>
  );
}