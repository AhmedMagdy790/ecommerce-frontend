import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema, type InventoryFormData, type InventoryFormInput } from "../../model/schema/inventorySchema";
// import { useInventoryStore } from "../../model/store/useInventoryStore";
import type { Inventory } from "../../model/types/inventory.types";
import { defaultInventoryValues } from "../constants/inventoryFormDefault";
import { mapInventoryToForm } from "../mappers/mapInventoryForm";
import { inventoryAdapter } from "../../adapters/inventory.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { useInventoryStore } from "../../model/store/useInvntoryStore";

export const useInventoryForm = (
    initialData?: Inventory | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useInventoryStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<InventoryFormInput, unknown, InventoryFormData>({
        resolver: zodResolver(inventorySchema),
        defaultValues: defaultInventoryValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapInventoryToForm(initialData) : defaultInventoryValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : defaultInventoryValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(defaultInventoryValues);
    };

    const submitInventory = async (formData: InventoryFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = inventoryAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = inventoryAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit inventory:", error);

            handleServerErrors(error, setError, [
                'product_variant_id' as Path<InventoryFormInput>,
                'stock_quantity' as Path<InventoryFormInput>,
                'reserved_quantity' as Path<InventoryFormInput>,
            ]);
        }
    };

    return {
        resetForm,
        submitInventory,
        methods,
        onSubmit: handleSubmit(submitInventory),
        isSubmitting,
        submitError,
        isEditMode,
    };
};