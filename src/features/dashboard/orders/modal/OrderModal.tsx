import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { Button } from "@/shared/components/Button";



import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { type IModal } from "@/shared/types/types";
import { type IOrder } from "../types/types";
import { useOrderStore } from "../store/useOrderStore";
import { type OrderFormData, orderSchema } from "../schema/orderSchema";
import { useCategoryStore } from "../../category/store/useCategoryStore";

interface IOrderModal extends IModal {
    order?: IOrder | null;
}

const statusOptions = [
    { label: "🟢 Active", value: "active" },
    { label: "📦 Archived", value: "archived" },
    { label: "📝 Draft", value: "draft" },
];

export default function OrderModal({
    isOpen,
    closeModal,
    order,
}: IOrderModal) {
    const { addOrder, updateOrder, isLoading } = useOrderStore();
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
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            payment_method: "",
            shipping_address: "",
            phone: 0,
            notes: "",
            city_id: 0,
            shipping_courier_id: 0
        },
    });


    // 🧠 Fill data on edit
    useEffect(() => {
        if (isOpen) {
            if (order) {
                reset({
                    payment_method: order.payment_method,
                    shipping_address: order.shipping_address,
                    phone: order.phone,
                    notes: order.notes,
                    city_id: order.city.id,
                    shipping_courier_id: order.shipping_courier.id
                });
            } else {
                reset({
                    payment_method: "",
                    shipping_address: "",
                    phone: 0,
                    notes: "",
                    city_id: 0,
                    shipping_courier_id: 0
                });
            }
        }
    }, [order, isOpen, reset]);



    // 🚀 Submit
    const onSubmit = async (data: OrderFormData) => {
        try {
            let success;

            if (order) {
                success = await updateOrder(order.id, data);
            } else {
                success = await addOrder(data);
            }

            if (success) {
                show("success", order ? "تم التعديل" : "تمت الإضافة");
                closeModal();
            }
        } catch (error) {

            handleServerErrors(error, setError, [
                "payment_method",
                "shipping_address",
                "phone",
                "notes",
                "city_id",
                "shipping_courier_id"
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
                variant={order ? "update" : "primary"}
                onClick={() => formRef.current?.requestSubmit()}
            >
                {isLoading
                    ? "Saving..."
                    : order
                        ? "Update Product"
                        : "Save Product"}
            </Button>
        </div>
    );

    return (
        <BaseModel
            isOpen={isOpen}
            closeModal={closeModal}
            isLoading={isLoading}
            action={<ActionButtons />}
            title={order ? "تعديل المنتج" : "إضافة منتج"}
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
        </BaseModel>
    );
}
