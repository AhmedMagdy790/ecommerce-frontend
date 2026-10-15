import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "@/api/axios-instance";
import { Button } from "@/shared/components/Button";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string | undefined;
  editingSection?: Section | null;
  onSectionSaved: (section: Section, isEditing: boolean) => void;
}

function SectionForm({
  onClose,
  pageId,
  editingSection,
  onSectionSaved,
}: AddSectionModalProps) {
  const { t } = useTranslation("cms");
  const [sectionType, setSectionType] = useState("hero");
  const [sectionName, setSectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageId) return;

    try {
      setIsLoading(true);
      if (editingSection) {
        // تعديل قسم موجود
        const res = await api.put(`/cms/sections/${editingSection.id}`, {
          name: sectionName,
          type: sectionType,
        });
        onSectionSaved(res.data.data || res.data, true);
      } else {
        // إضافة قسم جديد عبر مسار الـ cms/sections أو صفحات الـ sections
        const res = await api.post(`/cms/pages/${pageId}/sections`, {
          name: sectionName,
          type: sectionType,
        });
        onSectionSaved(res.data.data || res.data, false);
      }
      onClose();
    } catch (err) {
      console.error("Failed to save section", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
          {editingSection ? t("pageBuilder.editSection", "Edit Section") : t("pageBuilder.addSection", "Add New Section")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t("pageBuilder.sectionName", "Section Name")}
            </label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              required
              placeholder="e.g. Main Hero Banner"
              className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-alt)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t("pageBuilder.sectionType", "Section Type")}
            </label>
            <select
              value={sectionType}
              onChange={(e) => setSectionType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-alt)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="hero">Hero Banner</option>
              <option value="products">Featured Products</option>
              <option value="categories">Categories Grid</option>
              <option value="banner">Promo Banner</option>
              <option value="custom">Custom HTML</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("common.saving", "Saving...") : t("common.save", "Save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddSectionModal(props: AddSectionModalProps) {
  if (!props.isOpen) return null;

  return <SectionForm key={props.editingSection?.id ?? "new"} {...props} />;
}