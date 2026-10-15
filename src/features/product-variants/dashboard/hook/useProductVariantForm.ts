import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductVariantStore } from "../../model/store/useProductVariantStore";
import type { ProductVariant } from "../../model/types/productVariant.types";
import { mapProductVariantToForm } from "../mappers/productVariantForm.mapper";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { getFirstFormError } from "@/shared/utils/helper";
import { 
  variantSchema, 
  type variantFormData, 
  type variantFormInput 
} from "@/features/product-variants/model/schema/variantSchema";
import { defaultProductVariantValues } from "../constants/productVariantFormDefaults";

export const useProductVariantForm = (
  initialData?: ProductVariant | null,
  closeModal?: () => void,
  isOpen?: boolean
) => {
  const { create, update } = useProductVariantStore();
  const prevIsOpenRef = useRef(isOpen);

  const methods = useForm<variantFormInput, unknown, variantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: defaultProductVariantValues,
    mode: "onTouched",
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors }, 
  } = methods;

  const formError = getFirstFormError(errors);
  const isEditMode = Boolean(initialData?.id);

  const sanitizedInitialValues = useMemo(
      () => mapProductVariantToForm(initialData),
      [initialData?.id]
  );

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      reset(sanitizedInitialValues);
    }
  }, [isOpen, sanitizedInitialValues, reset]);

  const resetForm = () => {
    reset(defaultProductVariantValues);
  };

  const submitVariant = (payload: variantFormData) =>
      isEditMode && initialData?.id
          ? update(Number(initialData.id), payload)
          : create(payload);

  const onFormSubmit = async (data: variantFormData) => {
    try {
      const success = await submitVariant(data);
      if (success) {
        resetForm();
        closeModal?.();
      }
    } catch (error: unknown) {
      handleServerErrors(error, setError, [
        "sku" as Path<variantFormInput>,
        "price" as Path<variantFormInput>,
        "stock" as Path<variantFormInput>,
      ]);
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(onFormSubmit),
    isSubmitting,
    resetForm,
    formError,
    isEditMode,
  };
};