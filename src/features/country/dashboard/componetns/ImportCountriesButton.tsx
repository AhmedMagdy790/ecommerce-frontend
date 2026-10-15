import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Download } from "lucide-react";
import { adminApi } from "@/api/client";
import { useTranslation } from "react-i18next";
import { useCountryStore } from "../../model/store/useCountryStore";

interface ImportButtonProps {
  onSuccess?: () => void;
}

export default function ImportCountriesButton({ onSuccess }: ImportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

   const { 
      fetch, 
      isFetching 
    } = useCountryStore();
  


  const handleImport = async () => {
    if (!confirm(t("countries.confirm_import", "Are you sure you want to import/update countries and cities data?"))) {
      return;
    }

    try {
      setIsLoading(true);

      // استخدام الدالة التي أضفتها في الـ adminApi
      await adminApi.countrieImport();

      await fetch();
      
      alert(t("countries.import_success", "Countries and cities imported successfully!"));
      
      // // إعادة تحميل القائمة في الـ Store
      onSuccess?.();
    } catch (error) {
      console.error("Import failed:", error);
      alert(t("countries.import_error", "Import failed. Please check server logs."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleImport}
      isLoading={isLoading || isFetching}
      variant="secondary"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download size={16} />
      <span>{t("countries.import_button", "Import World Data")}</span>
    </Button>
  );
}