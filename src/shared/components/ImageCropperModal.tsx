import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import BaseModal from './BaseModal';
import { getCroppedImg } from '../utils/getCroppedImg';
import { Button } from './Button';
import { useStatusStore } from './StatusOverlay/statusStore';


interface Props {
  image: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export const ImageCropperModal = ({ image, open, onClose, onCropComplete }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropChange = (crop) => setCrop(crop)
  const onZoomChange = (zoom) => setZoom(zoom)

  const onCropCompleteInternal = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }finally {
      setIsLoading(false);
    }
  }

  return (
    <BaseModal isOpen={open} closeModal={onClose} title="قص الصورة الشخصية">
      <div className="relative w-full h-64 bg-gray-900 mt-4">
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
      
      <div className="mt-4">
        <label className="block text-sm mb-2 text-gray-400">التقريب (Zoom)</label>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={onClose} >إلغاء</Button>
        <Button isLoading={isLoading} onClick={handleSave} >حفظ وقص</Button>
      </div>
    </BaseModal>
  )
}