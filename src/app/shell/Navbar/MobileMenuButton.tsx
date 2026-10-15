import { Menu, X } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuButton({
  isOpen,
  onToggle,
}: MobileMenuButtonProps) {
  const { t } = useLang();

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center lg:hidden transition-all duration-fast hover:scale-105 active:scale-95"
      style={{
        height: "40px",
        width: "40px",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
      }}
      aria-label={
        isOpen
          ? t?.("nav.closeMenu")
          : t?.("nav.openMenu")
      }
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? (
        <X size={20} strokeWidth={2.2} style={{ color: "var(--color-primary)" }} />
      ) : (
        <Menu size={20} strokeWidth={2.2} />
      )}
    </button>
  );
}