import { useModal } from "@/hooks/useModal";
import EditProfileModal from "../modal/EditProfileModal";
import { useAuthStore } from "@/store/authStore";
import { Edit3 } from "lucide-react";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuthStore();

  return (
    <>
      <div 
        className="
          relative 
          p-6 
          rounded-[var(--radius-xl)] 
          border 
          border-[var(--color-border)] 
          bg-[var(--card-bg)] 
          shadow-[var(--shadow-xs)] 
          hover:shadow-[var(--shadow-sm)] 
          transition-all 
          duration-[var(--duration-normal)]
        "
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Left Content */}
          <div className="w-full">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Personal Information
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Your personal details and contact info
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Item: Full Name */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {user?.name || "-"}
                </p>
              </div>

              {/* Item: Email */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] break-all">
                  {user?.email || "-"}
                </p>
              </div>

              {/* Item: Phone */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {user?.phone || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-shrink-0">
            <button
              onClick={openModal}
              className="
                flex 
                w-full 
                items-center 
                justify-center 
                gap-2 
                rounded-[var(--radius-md)] 
                border 
                border-[var(--color-border)] 
                bg-[var(--color-background)] 
                px-4 
                py-2.5 
                text-sm 
                font-medium 
                text-[var(--color-text-secondary)] 
                shadow-[var(--shadow-xs)] 
                hover:bg-[var(--color-surface-secondary)] 
                hover:text-[var(--color-text-primary)] 
                hover:border-[var(--color-border-hover)] 
                transition-all 
                duration-[var(--duration-fast)]
                active:scale-95
                lg:w-auto
              "
            >
              <Edit3 size={16} className="opacity-70 transition-opacity" />
              <span>Edit Profile</span>
            </button>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}