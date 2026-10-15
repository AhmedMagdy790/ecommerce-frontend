// src/shared/components/ActionButtons.tsx (أو المسار الخاص بك)

import { Button } from "@/shared/components/Button";
import type { TFunction } from "i18next";
import type { RefObject } from "react";

interface ActionButtonsProps {
    closeModal: () => void;
    isEditMode: boolean;
    isSubmitting: boolean;
    t: TFunction;
    formRef: RefObject<HTMLFormElement | null>;
    saveLabel?: string;
    updateLabel?: string;
}

export const ActionButtons = ({
    closeModal,
    isEditMode,
    isSubmitting,
    t,
    formRef,
    saveLabel,
    updateLabel,
}: ActionButtonsProps) => {

    return (
        <div className="flex items-center justify-end gap-3 w-full">
            <Button type="button" variant="secondary" onClick={closeModal} size="sm" disabled={isSubmitting}>
                {t("actions.cancel", "Cancel")}
            </Button>

            <Button
                variant={isEditMode ? "update" : "primary"}
                onClick={() => formRef.current?.requestSubmit()}
                type="button"
                isLoading={isSubmitting}
                size="sm"
            >
                {isEditMode
                ? (updateLabel || t("actions.update", "Update"))
                : (saveLabel || t("actions.save", "Save"))}
            </Button>
        </div>
    );
};