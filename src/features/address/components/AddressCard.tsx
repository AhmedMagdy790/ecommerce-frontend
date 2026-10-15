import type { Address } from "../model/types/address.types";
import { MapPin, Phone, CheckCircle2, Trash2, Edit3, Star } from "lucide-react";

interface AddressCardProps {
  address: Address;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onSetDefault?: (id: number | string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressCardProps) {
  return (
    <div className={`p-5 rounded-2xl border transition-all bg-white dark:bg-gray-800 shadow-sm relative ${
      address.is_default 
        ? "border-primary ring-1 ring-primary/20" 
        : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
    }`}>
      {/* Top Section: Type & Default Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {address.type}
          </span>
          {address.is_default && (
            <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Default
            </span>
          )}
        </div>

        {/* Actions Buttons */}
        <div className="flex items-center gap-1">
          {/* زر تعيين كافتراضي يظهر فقط للعناوين غير الافتراضية */}
          {!address.is_default && onSetDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              disabled={isSettingDefault}
              title="Set as Default"
              className="p-2 text-gray-400 hover:text-primary transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <Star className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(address.id)}
              title="Edit Address"
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(address.id)}
              disabled={isDeleting}
              title="Delete Address"
              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {address.street_details}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {address.building_number ? `Building: ${address.building_number}, ` : ""}{typeof address.city?.name === "string" ? address.city.name : `City ID: ${address.city_id}`}
              {address.area ? `Area: ${address.area}, ` : ""}
              {typeof address.city?.name === "string" ? address.city.name : `City ID: ${address.city_id}`}, {typeof address.country?.name === "string" ? address.country.name : `Country ID: ${address.country_id}`}
            </p>
          </div>
        </div>

        {address.phone_contact && (
          <div className="flex items-center gap-2.5 pt-1 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50">
            <Phone className="w-3.5 h-3.5" />
            <span>{address.phone_contact}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressCard;