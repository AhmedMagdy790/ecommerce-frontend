import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  UserRound,
  Package,
  Clock,
  ShieldCheck,
  Calendar,
  Camera,
  Loader2,
} from "lucide-react";

import type { User } from "@/features/users/model/types/user.types";
import { ImageCropperModal } from "@/shared/components/ImageCropperModal";
import { useUpdateAvatar } from "../hooks/useUpdateAvatar";

interface ProfileHeaderProps {
  profile?: User | null;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { t } = useTranslation("profile");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { updateAvatar, isUpdatingAvatar, error } = useUpdateAvatar();

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !file.type.startsWith("image/")) return;

    setSelectedImage(URL.createObjectURL(file));
    setAvatarError(false);
    setIsCropperOpen(true);
  };

  const handleCropComplete = async (croppedFile: File) => {
    try {
      await updateAvatar(croppedFile);
      setIsCropperOpen(false);
      setSelectedImage(null);
    } catch {
      // error handling
    }
  };

  const closeCropper = () => {
    if (isUpdatingAvatar) return;

    setIsCropperOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div className="relative mb-8 overflow-hidden rounded-panel border border-border bg-surface shadow-sm">
        <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="relative px-6 pb-6 pt-0 lg:px-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="-mt-12 flex items-end gap-4">
              <div className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface-secondary text-primary shadow-md">
                {profile?.avatar && !avatarError ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name || ""}
                    onError={() => setAvatarError(true)}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound size={42} />
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUpdatingAvatar}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-100"
                  title={t("update_avatar", "تعديل الصورة الشخصية")}
                  aria-label={t("update_avatar", "تعديل الصورة الشخصية")}
                >
                  {isUpdatingAvatar ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <Camera className="size-6" />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUpdatingAvatar}
                />
              </div>

              <div className="mb-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                    {profile?.name || t("default_user_name", "المستخدم")}
                  </h1>

                  {profile?.email_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <ShieldCheck size={12} />
                      {t("account_verified", "حساب موثق")}
                    </span>
                  )}
                </div>

                <p className="break-all text-sm text-text-secondary">
                  {profile?.email}
                </p>
              </div>
            </div>

            {profile?.joined_at && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Calendar size={14} />
                <span>
                  {t("joined_date", "عضو منذ")}{" "}
                  {new Date(profile.joined_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-3.5 rounded-control bg-surface-secondary/50 p-3.5 transition-colors hover:bg-surface-secondary">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                <Package size={20} />
              </span>

              <div>
                <p className="text-xs text-text-muted">
                  {t("stats.total_orders", "إجمالي الطلبات")}
                </p>
                <p className="text-base font-bold text-text-primary">
                  {profile?.stats?.total_orders ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-control bg-surface-secondary/50 p-3.5 transition-colors hover:bg-surface-secondary">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-amber-500/10 text-amber-600">
                <Clock size={20} />
              </span>

              <div>
                <p className="text-xs text-text-muted">
                  {t("stats.active_orders", "طلبات قيد التنفيذ")}
                </p>
                <p className="text-base font-bold text-text-primary">
                  {profile?.stats?.active_orders ?? 0}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {t("avatar_update_failed", "تعذر تحديث الصورة. حاول مرة أخرى.")}
            </p>
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          open={isCropperOpen}
          onClose={closeCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}