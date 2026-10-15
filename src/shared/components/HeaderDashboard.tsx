import type { TFunction } from "i18next";
import { PackageIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";

interface HeaderDashboardProps {
    t: TFunction;
    title?: string;
    openCreateModal?: () => void;
    createButtonLabel?: string;
    showTrashed?: boolean;
    onToggleTrashed?: () => void;
    trashedButtonLabel?: string;
    children?: ReactNode; // Extra custom actions if needed
}

export const HeaderDashboard = ({
    t,
    title,
    openCreateModal,
    createButtonLabel,
    showTrashed,
    onToggleTrashed,
    trashedButtonLabel,
    children,
}: HeaderDashboardProps) => {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                <PackageIcon className="w-6 h-6 text-[var(--color-primary)]" />
                {title || t("title")}
            </h1>

            <div className="flex items-center gap-3">
                {/* Trashed Toggle Button */}
                {onToggleTrashed !== undefined && (
                    <button
                        type="button"
                        onClick={onToggleTrashed}
                        className={`
                            inline-flex items-center justify-center gap-2 
                            rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium 
                            transition-all duration-[var(--duration-fast)]
                            shadow-[var(--shadow-xs)] active:scale-95
                            ${
                                showTrashed
                                    ? "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                                    : "bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                            }
                        `}
                    >
                        <Trash2Icon className="w-4 h-4" />
                        {trashedButtonLabel || t("actions.trashed", "Trashed")}
                    </button>
                )}

                {children}

                {openCreateModal && (
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="
                            inline-flex items-center justify-center gap-2 
                            rounded-[var(--radius-md)] bg-[var(--color-primary)] 
                            px-4 py-2.5 text-sm font-medium text-white 
                            hover:bg-[var(--color-primary-hover)] 
                            transition-all duration-[var(--duration-fast)]
                            shadow-[var(--shadow-xs)] active:scale-95
                        "
                    >
                        <PlusIcon className="w-4 h-4" />
                        {createButtonLabel || t("actions.add", "Add New")}
                    </button>
                )}
            </div>
        </div>
    );
};