import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImg } from '../utils/getCroppedImg';
import { Button } from './Button';

interface Props {
  image: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export const ImageCropperModal = ({ image, open, onClose, onCropComplete }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropChange = (newCrop: { x: number; y: number }) => setCrop(newCrop);
  const onZoomChange = (newZoom: number) => setZoom(newZoom);

  const onCropCompleteInternal = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  // استخدام نظام الـ Z-Index الموجود في الـ Theme الخاص بك (أعلى من الـ modal العادي)
  return createPortal(
    <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] w-full max-w-lg overflow-hidden flex flex-col p-6 border border-[var(--color-border)]">
        
        {/* عنوان المودال */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">قص الصورة الشخصية</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* مساحة الـ Cropper */}
        <div className="relative w-full h-64 bg-gray-900 mt-4 rounded-[var(--radius-lg)] overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>
        
        {/* شريط التقريب (Zoom) */}
        <div className="mt-4">
          <label className="block text-sm mb-2 text-[var(--color-text-secondary)]">التقريب (Zoom)</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-[var(--color-surface-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[var(--color-border)]">
          <Button variant="secondary" onClick={onClose}>إلغاء</Button>
          <Button isLoading={isLoading} onClick={handleSave}>حفظ وقص</Button>
        </div>

      </div>
    </div>,
    document.body
  );
};