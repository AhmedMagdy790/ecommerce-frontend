import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash2, Plus, Link as LinkIcon, FileText } from "lucide-react";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TranslatedText } from "@/shared/types/types";
import type { NavMenuItem } from "../../model/types/navigation.types";

interface NavigationItemCardProps {
  item: NavMenuItem<TranslatedText>;
  index: number;
  lang: string;
  onEdit: (item: NavMenuItem<TranslatedText>) => void;
  onDelete: (id: number | string) => void;
  onAddSubItem: (parentId: number) => void;
}

export default function NavigationItemCard({
  item,
  lang,
  onEdit,
  onDelete,
  onAddSubItem,
}: NavigationItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const itemTitle = getLocalizedName(item.title, lang) || "Untitled Item";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-alt)] hover:border-[var(--color-primary)] transition-all shadow-sm ${
        isDragging ? "ring-2 ring-[var(--color-primary)] shadow-md" : ""
      }`}
    >
      {/* الجهة اليسرى: أيقونة السحب، العنوان، ونوع الرابط */}
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-lg hover:bg-[var(--color-background)] transition-colors"
          type="button"
        >
          <GripVertical size={18} />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">
              {itemTitle}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                item.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {item.is_active ? "نشط" : "غير نشط"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            {item.url ? (
              <span className="flex items-center gap-1">
                <LinkIcon size={12} className="text-[var(--color-primary)]" />
                {item.url}
              </span>
            ) : item.page_id ? (
              <span className="flex items-center gap-1">
                <FileText size={12} className="text-[var(--color-primary)]" />
                صفحة رقم: {item.page_id}
              </span>
            ) : (
              <span>رابط فارغ / حاوية</span>
            )}
            <span>•</span>
            <span>الترتيب: {item.sort_order}</span>
          </div>
        </div>
      </div>

      {/* الجهة اليمنى: أزرار التحكم (إضافة فرعي، تعديل، حذف) */}
      <div className="flex items-center gap-1">
        {/* زر إضافة عنصر فرعي تحته */}
        <button
          onClick={() => onAddSubItem(item.id)}
          title="إضافة عنصر فرعي"
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors"
          type="button"
        >
          <Plus size={16} />
        </button>

        {/* زر التعديل */}
        <button
          onClick={() => onEdit(item)}
          title="تعديل العنصر"
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors"
          type="button"
        >
          <Edit size={16} />
        </button>

        {/* زر الحذف */}
        <button
          onClick={() => onDelete(item.id)}
          title="حذف العنصر"
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          type="button"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}