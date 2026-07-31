import { useCountryStore } from "../store/useCountryStore";
import { useLang } from "@/shared/context/LanguageContext";
import { type ICountry } from "../types";

interface Props {
  country: ICountry;
}

export default function CountryItemCard({ country }: Props) {
  const { lang } = useLang();
  const isActive = country.is_active;
  const { toggleCountryStatus, deleteCountry } = useCountryStore();

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 
      ${isActive 
        ? "border-[var(--color-brand-500)] ring-1 ring-[var(--color-brand-500)]/20 bg-[var(--color-brand-25)] dark:bg-[var(--color-brand-950)] shadow-theme-md" 
        : "bg-white dark:bg-[var(--color-gray-dark)] border-[var(--color-gray-200)] dark:border-[var(--color-gray-800)] opacity-70"}`}>
      
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider 
          ${isActive 
            ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]' 
            : 'bg-[var(--color-error-50)] text-[var(--color-error-600)]'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
        
        <span className="text-theme-xs font-mono text-[var(--color-gray-400)] uppercase">
          {country.code}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-theme-sm font-bold text-[var(--color-gray-900)] dark:text-white">
          {country.name[lang]}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-[var(--color-gray-500)]">Phone Code:</span>
            <span className="text-[11px] font-semibold text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]">
                +{country.phone_code}
            </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 pt-4 border-t border-[var(--color-gray-100)] dark:border-[var(--color-gray-800)] flex justify-end gap-3">
        <button 
          onClick={() => deleteCountry(country.id)}
          className="text-theme-xs font-medium text-[var(--color-error-500)] hover:text-[var(--color-error-700)] transition-colors cursor-pointer">
            Delete
        </button>

        <button 
          onClick={() => toggleCountryStatus(country.id)}
          className={`text-theme-xs font-semibold transition-colors 
            ${country.is_active ? 'text-[var(--color-warning-600)]' : 'text-[var(--color-success-600)]'}`}>
          {country.is_active ? 'تعطيل' : 'تنشيط'}
        </button>
        
        <button className="text-theme-xs font-semibold text-[var(--color-brand-500)]">تعديل</button>
      </div>

    </div>
  );
}