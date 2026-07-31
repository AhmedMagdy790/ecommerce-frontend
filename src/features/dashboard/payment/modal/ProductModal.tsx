import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModal from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { Button } from "@/shared/components/Button";

// import { useProductStore } from "../store/useProductStore";
import { useCategoryStore } from "@/features/dashboard/category/store/useCategoryStore";
// import { productSchema, ProductFormData } from "../schema/productSchema";
// import { type IProduct } from "../types/types";

import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { type IModal } from "@/shared/types/types";
import type { IProduct } from "../../products/types/types";
import { useProductStore } from "../../products/store/useProductStore";
import { productSchema, type ProductFormData } from "../../products/schema/productSchema";

interface IProductModal extends IModal {
    product?: IProduct | null;
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
}: IProductModal) {
    const { addProduct, updateProduct, isLoading } = useProductStore();
    const { adminCategories, fetchAdminCategories } = useCategoryStore();
    const { show, hide } = useStatusStore.getState();

    const formRef = useRef<HTMLFormElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            brand: "",
            category_id: undefined,
            status: "active",
        },
    });

    // 🧠 Fill data on edit
    useEffect(() => {
        if (isOpen) {
            if (product) {
                reset({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    brand: product.brand || "",
                    category_id: product.category_id,
                    status: product.status,
                });
            } else {
                reset({
                    name: "",
                    description: "",
                    brand: "",
                    category_id: undefined,
                    status: "active",
                });
            }
        }
    }, [product, isOpen, reset]);

    // 🧠 Categories options
    const categoryOptions = adminCategories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }));

    useEffect(() => {
        fetchAdminCategories();
    }, [isOpen]);

    // 🚀 Submit
    const onSubmit = async (data: ProductFormData) => {
        try {
            let success;

            if (product) {
                success = await updateProduct(product.id, data);
            } else {
                success = await addProduct(data);
            }

            if (success) {
                show("success", product ? "تم التعديل" : "تمت الإضافة");
                closeModal();
            }
        } catch (error) {
            handleServerErrors(error, setError, [
                "name",
                "description",
                "brand",
                "category_id",
                "status",
            ]);
        } finally {
            setTimeout(() => hide(), 1200);
        }
    };

    const ActionButtons = () => (
        <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeModal}>
                Cancel
            </Button>

            <Button
                variant={product ? "update" : "primary"}
                onClick={() => formRef.current?.requestSubmit()}
            >
                {isLoading
                    ? "Saving..."
                    : product
                        ? "Update Product"
                        : "Save Product"}
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            closeModal={closeModal}
            isLoading={isLoading}
            action={<ActionButtons />}
            title={product ? "تعديل المنتج" : "إضافة منتج"}
            description="أدخل بيانات المنتج"
        >
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-5 py-6">

                    {/* name */}
                    <Input
                        label="اسم المنتج"
                        placeholder="مثال: iPhone 15"
                        error={errors.name?.message}
                        {...register("name")}
                    />

                    {/* category */}
                    <Controller
                        name="category_id"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                label="Category"
                                options={categoryOptions}
                                value={field.value?.toString() || ""}
                                onChange={field.onChange}
                                error={errors.category_id?.message}
                            />
                        )}
                    />

                    {/* brand */}
                    <Input
                        label="Brand"
                        placeholder="Apple"
                        error={errors.brand?.message}
                        {...register("brand")}
                    />

                    {/* status */}
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                label="Status"
                                options={statusOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.status?.message}
                            />
                        )}
                    />

                    {/* description */}
                    <Textarea
                        label="الوصف"
                        placeholder="اكتب وصف المنتج..."
                        error={errors.description?.message}
                        {...register("description")}
                    />

                </div>
            </form>
        </BaseModal>
    );
}
