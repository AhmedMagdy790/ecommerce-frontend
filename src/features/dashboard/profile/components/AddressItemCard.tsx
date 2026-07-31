import { useLang } from "@/shared/context/LanguageContext";
import { type IAddress } from "../types/profileTypes";
import { Button } from "@/shared/components/Button";


interface Props {
  address: IAddress;
  onEdit: (address: IAddress) => void;
  onDelete: (id: number) => void;
}

/** 
 * Refactored to use your custom theme colors (brand, success, orange)
 * instead of standard Tailwind defaults.
 */
const typeStyles = {
  home: "bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400",
  work: "bg-success-50 text-success-600 dark:bg-success-950/30 dark:text-success-400",
  other: "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
};

export default function AddressItemCard({ address, onDelete, onEdit }: Props) {
  const { t, translate } = useLang();
  

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 bg-white dark:bg-gray-dark 
      ${
        address.is_default
          ? "border-brand-500 ring-1 ring-brand-500/20 shadow-theme-md"
          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 shadow-theme-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-3 py-1 rounded-full text-theme-xs font-bold uppercase tracking-wider 
          ${typeStyles[address.type as keyof typeof typeStyles] || typeStyles.other}`}
        >
          {address.type}
        </span>

        {address.is_default && (
          <span className="text-theme-xs font-bold text-brand-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            {t("common.default")}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-theme-sm font-bold text-gray-900 dark:text-white">
          {translate(address?.country?.name)} — {translate(address?.city?.name)}
        </h4>
        <p className="text-theme-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {address.area_en}, {address.street_details}
        </p>
        
        {address.phone_contact && (
          <p className="text-theme-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
            <span className="opacity-70">{t("about.contact")}:</span> {address.phone_contact}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-4">
        <Button
          onClick={() => onEdit(address)}
          variant="outline"
          className="text-theme-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
        >
          {t("common.edit")}
        </Button>
        <Button
          onClick={() => onDelete(address.id)}
          variant="danger"
          className="text-theme-xs font-bold text-error-600 dark:text-error-400 hover:underline cursor-pointer"
        >
          {t("common.delete")}
        </Button>
      </div>
    </div>
  );
}