import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuButton({
  isOpen,
  onToggle,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-md
        text-text-primary
        transition-colors
        hover:bg-surface
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        lg:hidden
      "
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? (
        <X size={22} strokeWidth={2} />
      ) : (
        <Menu size={22} strokeWidth={2} />
      )}
    </button>
  );
}