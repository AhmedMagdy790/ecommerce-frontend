import React, { useState, useRef } from "react";
import { useModal } from "@/hooks/useModal";
import { useProfileStore } from "../store/useProfileStore";
import { MapPin, Briefcase } from "lucide-react";
import { ImageCropperModal } from "@/shared/components/ImageCropperModal";
import { useAuthStore } from "@/store/authStore";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuthStore();
  const { updateAvatar } = useProfileStore();

  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result as string);
        openModal();
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCroppedImage = async (file: File) => {
    await updateAvatar(file);
  };

  return (
    <>
      <div
        className="
          p-5 lg:p-6
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--card-bg)]
          transition-colors duration-[var(--duration-normal)]
          shadow-[var(--shadow-xs)]
        "
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div
              className="
                w-20
                h-20
                overflow-hidden
                rounded-full
                border
                border-[var(--color-border)]
                shadow-[var(--shadow-xs)]
                shrink-0
              "
            >
              <img 
                src={user?.avatar || "/images/user/owner.jpg"} 
                alt="user avatar" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="order-3 xl:order-2">
              <h4
                className="
                  mb-2
                  text-lg
                  font-semibold
                  text-center
                  xl:text-left
                  text-[var(--color-text-primary)]
                "
              >
                {user?.name || "Loading..."}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                  <Briefcase size={14} className="text-[var(--color-text-muted)]" /> 
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </p>
                <div className="hidden h-3.5 w-px bg-[var(--color-border)] xl:block"></div>
                <p className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                  <MapPin size={14} className="text-[var(--color-text-muted)]" /> 
                  {user?.address || "No address provided"}
                </p>
              </div>
            </div>

            {/* Social Links Slot / Action Group */}
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              {/* Future social handles can be rendered here */}
            </div>
          </div>

          <button
            onClick={handleEditClick}
            className="
              flex
              w-full
              lg:w-auto
              items-center
              justify-center
              gap-2
              rounded-[var(--radius-md)]
              px-4
              py-2.5
              text-sm
              font-medium
              border
              border-[var(--color-border)]
              bg-[var(--color-background)]
              text-[var(--color-text-secondary)]
              hover:bg-[var(--color-surface-secondary)]
              hover:text-[var(--color-text-primary)]
              hover:border-[var(--color-border-hover)]
              transition-all
              duration-[var(--duration-fast)]
              active:scale-95
              shadow-[var(--shadow-xs)]
            "
          >
            Edit Profile
          </button>
        </div>

        <input 
          ref={fileInputRef} 
          className="hidden" 
          type="file" 
          onChange={onFileChange} 
          accept="image/*" 
        />
      
        {tempImage && (
          <ImageCropperModal
            image={tempImage}
            open={isOpen}
            onClose={() => closeModal()}
            onCropComplete={handleCroppedImage}
          />
        )}
      </div>
    </>
  );
}