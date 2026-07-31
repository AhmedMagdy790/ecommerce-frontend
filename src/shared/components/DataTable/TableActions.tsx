import React from "react";
import { Edit, Trash2, RefreshCw } from "lucide-react";

interface TableActionsProps<T> {
  item: T;
  isRtl: boolean;
  showTrashed?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
}

export function TableActions<T>({
  item,
  isRtl,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
}: TableActionsProps<T>) {
  return (
    <div className="flex justify-center gap-2">
      {!showTrashed ? (
        <>
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={isRtl ? "تعديل" : "Edit"}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--red-500)]/10 text-[var(--color-error)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={isRtl ? "حذف" : "Delete"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <>
          {onRestore && (
            <button
              onClick={() => onRestore(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-success)]/10 text-[var(--color-success)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={isRtl ? "استعادة" : "Restore"}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--red-500)]/10 text-[var(--color-error)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={isRtl ? "حذف نهائي" : "Permanent Delete"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}