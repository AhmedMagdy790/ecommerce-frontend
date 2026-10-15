// src/pages/cities/constants/CityColumns.ts
import type { Column } from "@/shared/components/DataTable/types";
import type { City } from "../../model/types/city.types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";


interface GetCityColumnsProps {
  t: TFunction;
  lang: string;
  showTrashed?: boolean;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: boolean | string) => void;
}

export function getCityColumns({
  t,
  lang,
  showTrashed,
  togglingId,
  onStatusChange,
}: GetCityColumnsProps): Column<City>[] {
  return [
    {
      id: "name",
      header: t("city.name", "City Name"),
      accessor: (row) => getLocalizedName(row.name, lang),
    },
    {
      id: "country",
      header: t("city.country", "Country"),
      accessor: (row) => getLocalizedName(row?.country?.name, lang),
    },
    {
      id: "city_code",
      header: t("city.city_code", "City Code"),
      accessor: "city_code",
    },
    {
      id: "status",
      header: t("common.status", "Status"),
      accessor: "is_active", // أو "status" حسب نوع الـ backend الخاص بك
      render: (value, row) => {
        // دعم لحالة الـ boolean (is_active) أو النصية ("active")
        const isActive = typeof value === "boolean" ? value : value === "active";
        const isLoadingThis = togglingId === row.id;

        return (
          <button
            type="button"
            disabled={showTrashed || isLoadingThis}
            onClick={() => {
              if (showTrashed || isLoadingThis || !onStatusChange) return;
              // إرسال العكس (سواء كان بوليان أو نص حسب ما يطلبه الـ API)
              const newStatus = typeof value === "boolean" ? !isActive : (isActive ? "inactive" : "active");
              onStatusChange(row.id, newStatus);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              showTrashed || isLoadingThis
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            } ${
              isActive
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20"
            }`}
            title={!showTrashed ? t("status.toggle", "Click to change status") : undefined}
          >
            {isLoadingThis && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            <span>
              {isActive
                ? t("status.active", "Active")
                : t("status.inactive", "Inactive")}
            </span>
          </button>
        );
      },
    },
  ];
}