// src/features/product/dashboard/components/modal/ProductModal.tsx
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Controller, FormProvider, type Path } from "react-hook-form";

import BaseModal from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";

import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import type { InitialProductData } from "@/features/product/model/types/productForm.types";
import { useProductForm } from "../../hook/useProductForm";
import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { useCategoryOptions } from "@/features/category/dashboard/hook/useCategoryOptions";
import type { ProductFormInput } from "@/features/product/model/schema/productSchema";

interface ProductModalProps {
    isOpen: boolean;
    closeModal: () => void;
    product?: InitialProductData | null;
}

const statusOptions = [
    { label: "🟢 Active", value: "active" },
    { label: "📦 Archived", value: "archived" },
    { label: "📝 Draft", value: "draft" },
];

export default function ProductModal({
    isOpen,
    closeModal,
    product,
}: ProductModalProps) {
    const { t } = useTranslation("product");

    const { currentLangCode } = useLanguageStore();

    const formRef = useRef<HTMLFormElement>(null);

    const { isCategoriesLoading, categoryOptions} = useCategoryOptions();

    const {
        methods,
        onSubmit,
        isSubmitting,
        isEditMode,
        resetForm,
    } = useProductForm(product, closeModal, isOpen);

    const {
        register,
        control,
        formState: { errors },
    } = methods;

    const hasLanguageError = (currentLang: string) => {
        return checkLanguageError(errors, currentLang, ["name", "description"]);
    };

    const handleClose = () => {
        resetForm();
        closeModal();
    };

    const registerTranslatedField = (
        field: "name" | "description",
        lang: string
    ) => {
    return register(
        `${field}.${lang}` as Path<ProductFormInput>
    );
    };

    return (
        <BaseModal
            isOpen={isOpen}
            closeModal={handleClose}
            isLoading={isSubmitting}
            action={
                <ActionButtons
                    t={t}
                    closeModal={handleClose}
                    isEditMode={isEditMode}
                    isSubmitting={isSubmitting}
                    formRef={formRef}
                />
            }
            title={isEditMode ? t("modal.edit_title", "تعديل المنتج") : t("modal.create_title", "إضافة منتج")}
            description={t("modal.description", "أدخل بيانات المنتج")}
            maxWidth="max-w-2xl"
        >
            <LanguageOptions
                t={t}
                title={t("modal.basic.section_title", "بيانات المنتج الأساسية")}
                hasLanguageError={hasLanguageError}
            />

            <FormProvider {...methods}>
                <form ref={formRef} onSubmit={onSubmit}>
                    <div className="grid gap-5 py-6">
                        {/* Multi-language Name Inputs based on currentLangCode */}
                        <Input
                            label={t("fields.name", "اسم المنتج")}
                            placeholder={t("placeholders.name", "مثال: iPhone 15")}
                             error={getTranslatedError(errors.name, currentLangCode)}
                             {...registerTranslatedField("name", currentLangCode)}
                        />

                        {/* Category Select */}
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label={t("fields.category", "التصنيف")}
                                    options={categoryOptions}
                                    disabled={isCategoriesLoading}
                                    value={field.value?.toString() || ""}
                                    onChange={field.onChange}
                                    error={errors.category_id?.message}
                                />
                            )}
                        />

                        {/* Status Select */}
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label={t("fields.status", "الحالة")}
                                    options={statusOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.status?.message}
                                />
                            )}
                        />

                        {/* Multi-language Description Textarea based on currentLangCode */}
                        <Textarea
                            label={t("fields.description", "الوصف")}
                            placeholder={t("placeholders.description", "اكتب وصف المنتج...")}
                             error={getTranslatedError(errors.description, currentLangCode)}
                            {...registerTranslatedField("description", currentLangCode)}
                        />
                    </div>
                </form>
            </FormProvider>
        </BaseModal>
    );
}