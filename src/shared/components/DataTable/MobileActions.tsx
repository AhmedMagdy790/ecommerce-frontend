import React from "react";

interface MobileActionsProps<T> {
  item: T;
  isRtl: boolean;
  showTrashed?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
}

export function MobileActions<T>({
  item,
  isRtl,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
}: MobileActionsProps<T>) {
  if (!onEdit && !onDelete && !onRestore) return null;

  return (
    <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
      {onEdit && !showTrashed && (
        <button
          onClick={() => onEdit(item)}
          className="flex-1 py-2 bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-medium transition-all active:scale-95"
        >
          {isRtl ? "تعديل" : "Edit"}
        </button>
      )}
      {onRestore && showTrashed && (
        <button
          onClick={() => onRestore(item)}
          className="flex-1 py-2 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-medium transition-all active:scale-95"
        >
          {isRtl ? "استعادة" : "Restore"}
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(item)}
          className="flex-1 py-2 bg-[var(--red-500)]/10 text-[var(--color-error)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-medium transition-all active:scale-95"
        >
          {isRtl ? "حذف" : "Delete"}
        </button>
      )}
    </div>
  );
}