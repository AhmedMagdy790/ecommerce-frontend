import { useState, useRef, useEffect } from "react";
import { Controller, type Control, useFormContext, type FieldValues } from "react-hook-form";
import { User, Mail, Check, Loader2, ChevronDown, X } from "lucide-react";
import { useUserOptions } from "../dashboard/hook/useUserOptions";
import { DebouncedSearchInput } from "@/shared/components/DebouncedSearchInput";

interface UserSelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name?: string;
  label?: string;
  placeholder?: string;
  onUserSelect?: (userId: string | number) => void;
  disabled?: boolean;
  control?: Control<TFieldValues>;
}

export function UserSelectField<TFieldValues extends FieldValues = FieldValues>({
  name = "user_id",
  label = "اختيار مستخدم حالي",
  placeholder = "اختر مستخدماً...",
  onUserSelect,
  disabled = false,
  control: externalControl,
}: UserSelectFieldProps<TFieldValues>) {
  const formContext = useFormContext();
  const control = formContext?.control || externalControl;

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { users, isUsersLoading } = useUserOptions({
    filters: searchTerm ? { search: searchTerm } : undefined,
  });

  // إغلاق القائمة عند النقر خارج المكون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!control) {
    console.error("UserSelectField must be used within a FormProvider or passed a control prop.");
    return null;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedUser = users?.find(
          (u) => String(u.id) === String(field.value)
        );

        return (
          <div ref={containerRef} className="relative flex flex-col gap-1.5 w-full">
            {label && (
              <label className="text-xs font-medium text-foreground">
                {label}
              </label>
            )}

            {/* 📦 صندوق الاختيار الرئيسي (Trigger Box) */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2 bg-background border rounded-[var(--radius-md)] text-xs text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  error ? "border-[var(--color-error)]" : "border-border"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <User size={14} className="text-muted-foreground shrink-0" />
                  <span className={`truncate ${!selectedUser ? "text-muted-foreground" : ""}`}>
                    {selectedUser ? `${selectedUser.name} (${selectedUser.email})` : placeholder}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* زر مسح الاختيار السريع */}
                  {field.value && !disabled && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(null);
                        setSearchTerm("");
                        if (onUserSelect) onUserSelect("");
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                      title="إلغاء التحديد"
                    >
                      <X size={13} />
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* 📋 القائمة المنسدلة التي تحتوي على حقل البحث والنتائج */}
            {isOpen && !disabled && (
              <div className="absolute top-[calc(100%+4px)] z-50 w-full bg-background border border-border rounded-[var(--radius-md)] shadow-lg overflow-hidden">
                {/* 🔍 حقل البحث في أعلى القائمة */}
                <div className="p-2 border-b border-border bg-muted/20">
                  <DebouncedSearchInput
                    value={searchTerm}
                    onChange={(val) => setSearchTerm(val)}
                    placeholder="ابحث بالاسم أو البريد..."
                    className="w-full"
                  />
                </div>

                {/* قائمة المستخدمين */}
                <div className="max-h-60 overflow-y-auto divide-y divide-border">
                  {isUsersLoading ? (
                    <div className="flex items-center justify-center gap-2 p-3 text-xs text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري البحث...
                    </div>
                  ) : users && users.length > 0 ? (
                    users.map((user) => {
                      const isSelected = String(field.value) === String(user.id);

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            field.onChange(user.id);
                            setIsOpen(false);
                            setSearchTerm("");
                            if (onUserSelect) onUserSelect(user.id);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 text-right transition-colors hover:bg-muted/50 ${
                            isSelected ? "bg-primary/10" : ""
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            {/* 👤 اسم المستخدم */}
                            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground truncate">
                              <User size={14} className="text-muted-foreground shrink-0" />
                              <span className="truncate">{user.name}</span>
                            </div>

                            {/* 📧 البريد الإلكتروني */}
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                              <Mail size={12} className="shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <Check size={16} className="text-primary shrink-0 mr-2" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-xs text-center text-muted-foreground">
                      لا يوجد مستخدمين مطابقين للبحث
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ⚠️ عرض أخطاء الـ Validation */}
            {error?.message && (
              <span className="text-[11px] font-medium text-[var(--color-error)]">
                {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
}