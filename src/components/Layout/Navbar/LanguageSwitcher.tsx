import { Languages } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Change language"
      className="
        inline-flex
        h-10
        items-center
        gap-2
        rounded-lg
        px-3
        text-sm
        font-medium
        text-text-primary
        transition-colors
        hover:bg-surface
        focus:outline-none
        focus:ring-2
        focus:ring-primary
      "
    >
      <Languages size={18} />

      <span className="uppercase">
        {language}
      </span>
    </button>
  );
}