// src/shared/components/DataTable/MobileActions.tsx
import { useTranslation } from "react-i18next";
import { Edit2, RotateCcw, Trash2 } from "lucide-react";

interface MobileActionsProps<T> {
  item: T;
  showTrashed?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
}

export function MobileActions<T>({
  item,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
}: MobileActionsProps<T>) {
  const { t } = useTranslation("common");

  if (!onEdit && !onDelete && !onRestore) return null;

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
      {/* 1. زر التعديل */}
      {onEdit && !showTrashed && (
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-medium transition-all active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
          <span>{t("edit", "Edit")}</span>
        </button>
      )}

      {/* 2. زر الاستعادة */}
      {onRestore && showTrashed && (
        <button
          type="button"
          onClick={() => onRestore(item)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--color-success)]/10 hover:bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-[var(--radius-md)] text-xs font-medium transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t("restore", "Restore")}</span>
        </button>
      )}

      {/* 3. زر الحذف */}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--color-error)]/10 hover:bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/20 rounded-[var(--radius-md)] text-xs font-medium transition-all active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>
            {showTrashed
              ? t("force_delete", "Delete Permanently")
              : t("delete", "Delete")}
          </span>
        </button>
      )}
    </div>
  );
}