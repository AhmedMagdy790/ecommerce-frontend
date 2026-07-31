import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, X, Image as ImageIcon, Trash2 } from "lucide-react";
import type { ProductFormData } from "../../schema/productSchema";

export default function MediaStep({ isUpdate = false }: { isUpdate?: boolean }) {
  const { setValue, watch, getValues, formState: { errors } } = useFormContext<ProductFormData>();
  
  const featuredImage = watch("featured_image");
  const gallery = watch("gallery") || [];
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);

  // Handle featured image preview generation and memory cleanup
  useEffect(() => {
    if (!featuredImage) {
      setFeaturedPreview(null);
      return;
    }

    if (featuredImage instanceof File) {
      const url = URL.createObjectURL(featuredImage);
      setFeaturedPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof featuredImage === "string") {
      setFeaturedPreview(featuredImage);
    }
  }, [featuredImage]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setValue("gallery", [...gallery, ...filesArray], { shouldValidate: true });
    }
  };

  const removeGalleryImage = (index: number) => {
    const itemToRemove = gallery[index];
    if (itemToRemove && typeof itemToRemove === "object" && "id" in itemToRemove && itemToRemove.id) {
      const currentRemoved = getValues("remove_images") || [];
      setValue("remove_images", [...currentRemoved, itemToRemove.id]);
    }
    const updatedGallery = gallery.filter((_, i) => i !== index);
    setValue("gallery", updatedGallery, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 py-4">
      {/* --- Featured Image Section --- */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <ImageIcon size={18} className="text-[var(--color-primary)]" /> الصورة الرئيسية للمنتج
        </label>
        
        <div className="relative w-full h-56 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] flex flex-col items-center justify-center bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-secondary)]/80 transition-all group overflow-hidden shadow-[var(--shadow-xs)]">
          {featuredPreview ? (
            <>
              <img src={featuredPreview} alt="Featured" className="w-full h-full object-contain p-2" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => { 
                    setValue("featured_image", null); 
                  }}
                  className="p-2 bg-[var(--red-500)] text-white rounded-full hover:scale-110 transition-transform shadow-[var(--shadow-xs)]"
                  title="Remove Featured Image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </>
          ) : (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <UploadCloud size={32} className="text-[var(--color-primary)] mb-2" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">اضغط لرفع الصورة الرئيسية</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setValue("featured_image", file, { shouldValidate: true });
                    }
                }}
              />
            </label>
          )}
        </div>
        {errors.featured_image && <p className="text-[var(--color-error)] text-xs">{errors.featured_image.message?.toString()}</p>}
      </div>

      {/* --- Gallery Images Section --- */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <UploadCloud size={18} className="text-[var(--color-primary)]" /> معرض الصور الإضافية
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gallery.map((file: any, index: number) => {
            const isFile = file instanceof File;
            const imgUrl = isFile ? URL.createObjectURL(file) : (file?.url || "");

            return (
              <div key={index} className="relative aspect-square border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-secondary)] group shadow-[var(--shadow-xs)]">
                <img 
                  src={imgUrl} 
                  className="w-full h-full object-cover"
                  alt={`Gallery item ${index + 1}`}
                />
                <button 
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1.5 end-1.5 p-1 bg-[var(--red-500)] text-white rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-opacity shadow-[var(--shadow-xs)]"
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
                {isFile && (
                  <span className="absolute bottom-1 start-1 bg-[var(--color-primary)] text-[8px] text-white px-1.5 py-0.5 rounded-[var(--radius-sm)] font-medium">جديد</span>
                )}
              </div>
            );
          })}

          <label className="aspect-square border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] transition-all bg-[var(--color-surface-secondary)]/50">
            <UploadCloud size={20} className="text-[var(--color-text-muted)]" />
            <input 
                type="file" 
                multiple 
                className="hidden" 
                accept="image/*"
                onChange={handleGalleryChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}