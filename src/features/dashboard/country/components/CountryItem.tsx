import React from "react";
import { Globe, Phone, CheckCircle2, XCircle } from "lucide-react";
import { type ICountry } from "../types";

interface Props {
  country: ICountry;
  lang: "ar" | "en";
}

export default function CountryItem({ country, lang }: Props) {

  const displayName = country.name[lang] || country.name['ar'];

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
    
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
          {country.code}
        </div>

        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {displayName}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> {country.code}
            </span>
            <span className="flex items-center gap-1 text-ltr">
              <Phone className="w-3 h-3" /> +{country.phone_code}
            </span>
          </div>
        </div>
      </div>

      {/* حالة التفعيل */}
      <div>
        {country.is_active ? (
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            {lang === 'ar' ? 'نشط' : 'Active'}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            {lang === 'ar' ? 'معطل' : 'Inactive'}
          </span>
        )}
      </div>
    </div>
  );
}