import { useFormContext } from "react-hook-form";
// import { ProductFormData } from "../../schema/productSchema";
import { UploadCloud, X, Image as ImageIcon, Trash2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import type { ProductFormData } from "@/features/dashboard/products/schema/productSchema";



export default function MediaStep({ isUpdate = false }: { isUpdate?: boolean }) {
  const { setValue, watch, getValues, formState: { errors } } = useFormContext<ProductFormData>();
  
  const featuredImage = watch("featured_image");
  const gallery = watch("gallery") || [];
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);

  // --- هذا هو الجزء المفقود الذي يجب إعادته ---
  useEffect(() => {
    if (!featuredImage) {
      setFeaturedPreview(null);
      return;
    }

    // إذا كانت الصورة ملفاً جديداً (File) ننشئ لها رابطاً مؤقتاً
    if (featuredImage instanceof File) {
      const url = URL.createObjectURL(featuredImage);
      setFeaturedPreview(url);
      return () => URL.revokeObjectURL(url); // تنظيف الذاكرة
    } 
    
    // إذا كانت الصورة رابطاً قادماً من السيرفر (String)
    else if (typeof featuredImage === "string") {
      setFeaturedPreview(featuredImage);
    }
  }, [featuredImage]);
  // ------------------------------------------

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setValue("gallery", [...gallery, ...filesArray], { shouldValidate: true });
    }
  };

  const removeGalleryImage = (index: number) => {
    const itemToRemove = gallery[index];
    if (itemToRemove && itemToRemove.id) {
      const currentRemoved = getValues("remove_images") || [];
      setValue("remove_images", [...currentRemoved, itemToRemove.id]);
    }
    const updatedGallery = gallery.filter((_, i) => i !== index);
    setValue("gallery", updatedGallery, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 py-4">
      {/* --- الصورة الرئيسية --- */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <ImageIcon size={18} className="text-brand-500" /> الصورة الرئيسية للمنتج
        </label>
        
        <div className="relative w-full h-56 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all group overflow-hidden">
          {featuredPreview ? (
            <>
              <img src={featuredPreview} alt="Featured" className="w-full h-full object-contain p-2" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => { 
                    setValue("featured_image", null); 
                  }}
                  className="p-2 bg-red-500 text-white rounded-full hover:scale-110"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </>
          ) : (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <UploadCloud size={32} className="text-brand-500 mb-2" />
              <span className="text-sm font-medium">اضغط لرفع الصورة الرئيسية</span>
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
        {errors.featured_image && <p className="text-red-500 text-xs">{errors.featured_image.message?.toString()}</p>}
      </div>

      {/* --- معرض الصور --- */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <UploadCloud size={18} className="text-brand-500" /> معرض الصور الإضافية
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gallery.map((file, index) => {
            // منطق تحديد مصدر الصورة
            const isFile = file instanceof File;
            const imgUrl = isFile ? URL.createObjectURL(file) : (file?.url || "");

            return (
              <div key={index} className="relative aspect-square border rounded-xl overflow-hidden bg-gray-50 group">
                <img 
                  src={imgUrl} 
                  className="w-full h-full object-cover"
                  // ملاحظة: لا تستدعي revokeObjectURL هنا لأنه سيحذف الرابط فوراً قبل العرض
                />
                <button 
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                {/* علامة توضيحية للصور الجديدة */}
                {isFile && (
                  <span className="absolute bottom-1 left-1 bg-brand-500 text-[8px] text-white px-1 rounded">جديد</span>
                )}
              </div>
            );
          })}

          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-all">
            <UploadCloud size={20} className="text-gray-400" />
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