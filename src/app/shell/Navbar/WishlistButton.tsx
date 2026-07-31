import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

export default function WishlistButton() {
  const { lang } = useLang();

  return (
    <Link
      to="/wishlist"
      aria-label={lang === "ar" ? "قائمة الأمنيات" : "Wishlist"}
      title={lang === "ar" ? "قائمة الأمنيات" : "Wishlist"}
      className="inline-flex items-center justify-center transition-all duration-fast hover:scale-105 active:scale-95 group"
      style={{
        height: "40px",
        width: "40px",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      <Heart
        size={18}
        strokeWidth={2.2}
        className="transition-transform duration-normal group-hover:scale-110"
        style={{ color: "var(--color-text-primary)" }}
      />
    </Link>
  );
}