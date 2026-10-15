import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { Section } from "../../../section/model/types/section.types";

interface SectionCardProps {
  section: Section;
  index: number;
  lang: string;
  onEdit: (section: Section) => void;
  onDelete: (id: string | number) => void;
}

export default function SectionCard({ section, index, lang, onEdit, onDelete }: SectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const sectionName = getLocalizedName(section.name || section.title, lang);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-xl border bg-[var(--color-background)] border-[var(--color-border)] shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* زر السحب والإفلات */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </button>

        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-background-alt)] text-sm font-semibold text-[var(--color-text-secondary)]">
          {index + 1}
        </span>

        <div>
          <h4 className="font-semibold text-[var(--color-text-primary)]">{sectionName || `Section #${section.id}`}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
            {section.type || "Custom Section"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(section)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-alt)] rounded-lg transition-colors"
          title="Edit Section"
        >
          <Pencil size={18} />
        </button>
        <button
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