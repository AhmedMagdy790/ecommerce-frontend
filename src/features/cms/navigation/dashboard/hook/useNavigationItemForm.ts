import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { navMenuItemSchema, type NavMenuItemFormData, type NavMenuItemFormInput } from "../../model/schema/navMenuItemSchema";
import type { InitialNavMenuItemData } from "../../model/types/navigation.types";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import navigationItemAdapter from "../../adapters/navigationItem.adapter";
import { useNavigationItemStore } from "../../model/store/useNavigationItemStore";

const defaultValues: NavMenuItemFormInput = {
    nav_menu_id: 0,
    title: {},
    page_id: null,
    url: "",
    parent_id: null,
    sort_order: 0,
    is_active: true,
};

export const useNavigationItemForm = (
    navMenuId: number,
    initialData?: InitialNavMenuItemData | null,
    closeModal?: () => void,
    isOpen?: boolean,
    parentId?: number | null
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useNavigationItemStore();

    const prevIsOpenRef = useRef(isOpen);


    const methods = useForm<NavMenuItemFormInput, unknown, NavMenuItemFormData>({
        resolver: zodResolver(navMenuItemSchema),
        defaultValues: {
            ...defaultValues,
            nav_menu_id: navMenuId,
            parent_id: parentId ?? null,
        }
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? {
            nav_menu_id: initialData.nav_menu_id,
            title: initialData.title,
            page_id: initialData?.page?.id ?? null,
            url: initialData.url ?? "",
            parent_id: initialData.parent_id ?? null,
            sort_order: initialData.sort_order ?? 0,
            is_active: initialData.is_active,
        } : {
            ...defaultValues,
            nav_menu_id: navMenuId,
            parent_id: parentId ?? null,
        }),
        [initialData, navMenuId, parentId]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : {
                ...defaultValues,
                nav_menu_id: navMenuId,
                parent_id: parentId ?? null,
            });
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues, navMenuId, parentId]);

    const resetForm = () => {
        reset({
            ...defaultValues,
            nav_menu_id: navMenuId,
            parent_id: parentId ?? null,
        });
    };

    const submitNavigationItem = async (formData: NavMenuItemFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = navigationItemAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = navigationItemAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit navigation item:", error);

            handleServerErrors(error, setError, [
                'title',
                'page_id',
                'url',
                'parent_id',
                'sort_order',
                'is_active'
            ]);
        }
    };

    return {
        resetForm,
        submitNavigationItem,
        methods,
        onSubmit: handleSubmit(submitNavigationItem),
        isSubmitting,
        submitError,
        isEditMode,
    };
};