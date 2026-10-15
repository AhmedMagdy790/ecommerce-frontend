// src/features/category/components/ImageUploadField.tsx
import { useState, useEffect, useMemo } from "react";
import { UploadCloud, Trash2, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ImageCropperModal } from "./ImageCropperModal";

interface ImageUploadFieldProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  error?: string;
  label?: string;
  variant?: "default" | "avatar" | "compact";
}

export function ImageUploadField({ 
  value, 
  onChange, 
  error, 
  label,
  variant = "default" 
}: ImageUploadFieldProps) {
  const { t } = useTranslation();
  const preview = useMemo(() => {
    if (!value) return null;
    return value instanceof File ? URL.createObjectURL(value) : value;
  }, [value]);

  const [tempImageForCrop, setTempImageForCrop] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  useEffect(() => {
    if (value instanceof File && preview) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [value, preview]);

  // دالة التعامل مع اختيار الملف وفتحه في مودال القص
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImageForCrop(url);
      setIsCropperOpen(true);
    }
    e.target.value = "";
  };

  const handleCloseCropper = () => {
    setIsCropperOpen(false);
    setTempImageForCrop(null);
  };

  const handleCropComplete = (croppedFile: File) => {
    onChange(croppedFile);
    setIsCropperOpen(false);
    setTempImageForCrop(null);
  };

  return (
    <div className="space-y-2">
      {/* 1. الشكل الدائري (Avatar) */}
      {variant === "avatar" && (
        <>
          {label && (
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 block">
              {label}
            </label>
          )}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-[var(--color-border)] flex items-center justify-center bg-[var(--color-surface-secondary)] overflow-hidden group">
              {preview ? (
                <>
                  <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onChange(null)}
                      className="p-1.5 bg-[var(--red-500)] text-white rounded-full hover:scale-110 transition-transform shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer w-full h-full flex items-center justify-center">
                  <ImageIcon size={20} className="text-[var(--color-text-secondary)]" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              )}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              <p>{t("imageUpload.avatarHint", "Upload a square image for best results.")}</p>
            </div>
          </div>
        </>
      )}

      {/* 2. الشكل المضغوط (Compact) */}
      {variant === "compact" && (
        <>
          {label && (
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 block">
              {label}
            </label>
          )}
          <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)]">
            {preview ? (
              <div className="flex items-center gap-3">
                <img src={preview} alt="Compact" className="w-10 h-10 object-cover rounded" />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">
                  {t("imageUpload.imageUploaded", "Image attached")}
                </span>
              </div>
            ) : (
              <span className="text-xs text-[var(--color-text-secondary)]">
                {t("imageUpload.noImageSelected", "No image selected")}
              </span>
            )}
            <div className="flex items-center gap-2">
              {preview ? (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="p-1.5 bg-[var(--red-500)] text-white rounded hover:opacity-90"
                >
                  <Trash2 size={16} />
                </button>
              ) : (
                <label className="cursor-pointer px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs rounded font-medium flex items-center gap-1.5">
                  <UploadCloud size={14} />
                  {t("imageUpload.browse", "Browse")}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              )}
            </div>
          </div>
        </>
      )}

      {/* 3. الشكل الافتراضي (Default / Dashed Box) */}
      {variant === "default" && (
        <>
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 block">
            {label || t("imageUpload.categoryImage", "Category Image")}
          </label>
          <div className="relative w-full h-36 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] flex flex-col items-center justify-center bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-secondary)]/80 transition-all group overflow-hidden">
            {preview ? (
              <>
                <img src={preview} alt="Category" className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="p-2 bg-[var(--red-500)] text-white rounded-full hover:scale-110 transition-transform shadow-sm"
                    title="Remove image"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <UploadCloud size={28} className="text-[var(--color-primary)] mb-2" />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">
                  {t("imageUpload.clickToUpload", "Click to upload category image")}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </div>
        </>
      )}

      {/* رسالة الخطأ العامة */}
      {error && (
        <p className="text-xs text-[var(--color-error)] font-medium px-1">
          {error}
        </p>
      )}

      {/* مودال القص (يتم عرضه مرة واحدة فقط هنا لتجنب التكرار ولحل مشاكل الـ Z-Index) */}
      {tempImageForCrop && (
        <ImageCropperModal
          image={tempImageForCrop}
          open={isCropperOpen}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}