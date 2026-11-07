// src/app/shell/Navbar/CountrySelector.tsx
import { useTranslation } from "react-i18next";
import { useRegion } from "@/shared/context/RegionContext";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import CustomSelect from "@/shared/components/CustomSelect";
import type { Option } from "@/shared/components/CustomSelect";

export default function CountrySelector() {
  const { t } = useTranslation("common");
  const { selectedCountry, countries, changeCountry, isLoading } = useRegion();
  const { lang } = useLang();

  const countryOptions: Option[] = countries.map((country) => {
    const displayName = getLocalizedName(country.name, lang);
    return {
      label: `${displayName} (${country.currency})`,
      value: country.id,
    };
  });

  if (isLoading || !selectedCountry) {
    return <div className="h-9 w-32 animate-pulse bg-surface-muted rounded-control" />;
  }

  return (
    <div className="w-40">
      <CustomSelect
        options={countryOptions}
        value={selectedCountry.id}
        onChange={(val) => {
          if (val === "" || val == null) return;
          const countryId = Number(val);
          const found = countries.find((c) => c.id === countryId);
          if (found) {
            changeCountry(found);
          }
        }}
        placeholder={t("navbar.selectCountry", "اختر الدولة")}
      />
    </div>
  );
}