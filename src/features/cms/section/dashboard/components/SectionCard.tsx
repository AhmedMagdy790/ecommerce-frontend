import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, ListOrdered, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import type { Section } from "../../model/types/section.types";
import { getLocalizedName } from "@/shared/utils/localizeName";

interface SectionCardProps {
  section: Section;
  index: number;
  lang: string;
  onEdit: (section: Section) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void; // إضافة دالة تبديل الحالة
}

export default function SectionCard({ 
  section, 
  index, 
  lang, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: SectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  // افتراض أن خاصية الحالة في الـ section اسمها is_active أو status (يمكنك تعديلها حسب الـ Model لديك)
  const isActive = section.is_active ?? true; 

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-xl border bg-[var(--color-background)] border-[var(--color-border)] shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* زر السحب والإفلات */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </button>

        {/* رقم الترتيب */}
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-background-alt)] text-sm font-semibold text-[var(--color-text-secondary)]">
          {index + 1}
        </span>

        {/* اسم ونوع القسم */}
        <div>
          <h4 className="font-semibold text-[var(--color-text-primary)]">{getLocalizedName(section.name, lang)}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium inline-block mt-1">
            {section.type || "Custom Section"}
          </span>
        </div>
      </div>

      {/* الأزرار الإجرائية (العناصر، تبديل الحالة، تعديل، حذف) */}
      <div className="flex items-center gap-1.5">
        {/* زر الانتقال لعناصر القسم */}
        <Link
          to={`/admin/cms/sections/${section.id}/items`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
          title={lang === "ar" ? "إدارة العناصر" : "Manage Items"}
        >
          <ListOrdered size={16} />
          <span>{lang === "ar" ? "العناصر" : "Items"}</span>
        </Link>

        {/* زر تبديل الحالة (Toggle Status) */}
        <button
          type="button"
          onClick={() => onToggleStatus(section.id)}
          className={`p-2 rounded-lg transition-colors ${
            isActive 
              ? "text-emerald-600 hover:bg-emerald-50" 
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-background-alt)]"
          }`}
          title={lang === "ar" ? (isActive ? "إخفاء القسم" : "إظهار القسم") : (isActive ? "Hide Section" : "Show Section")}
        >
          {isActive ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

        {/* زر التعديل */}
        <button
          type="button"
          onClick={() => onEdit(section)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-alt)] rounded-lg transition-colors"
          title="Edit Section"
        >
          <Pencil size={18} />
        </button>

        {/* زر الحذف */}
        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
          title="Delete Section"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}