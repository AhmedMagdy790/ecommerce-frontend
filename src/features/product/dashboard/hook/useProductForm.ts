// src/features/product/dashboard/hooks/useProductForm.ts
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductStepper } from "./useProductStepper";
import { 
  productSchema, 
  type ProductFormData, 
  type ProductFormInput 
} from "../../model/schema/productSchema";
import { useProductStore } from "../../model/store/useProductStore";
import { buildProductPayload } from "../mappers/productPayload.mapper";
import type { CreateProductDto } from "../../model/types/product.dto";
import { defaultValues } from "../constants/productFormDefaults";
import type { InitialProductData } from "../../model/types/productForm.types";
import { mapProductToForm } from "../mappers/productForm.mapper";
import { type Path } from "react-hook-form";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import { getFirstFormError } from "@/shared/utils/helper";




export const useProductForm = (
  initialData?: InitialProductData | null,
  closeModal?: () => void,
  isOpen?: boolean
) => {
  const { create, update } = useProductStore();
  const prevIsOpenRef = useRef(isOpen);

  const methods = useForm<ProductFormInput, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    setError,
    formState: { isSubmitting, errors }, 
  } = methods;

  const formError = getFirstFormError(errors);

  const { currentStep, nextStep, prevStep, resetStep, isLastStep } = useProductStepper(trigger);

  const isEditMode = Boolean(initialData?.id);

  const sanitizedInitialValues = useMemo(
      () => mapProductToForm(initialData),
      [initialData?.id]
  );

  // Keep track of the previous initialData id to detect when async data arrives
  const prevInitialDataIdRef = useRef(initialData?.id);

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    const dataArrived = isOpen && initialData?.id && initialData.id !== prevInitialDataIdRef.current;

    prevIsOpenRef.current = isOpen;
    prevInitialDataIdRef.current = initialData?.id;

    if (justOpened || dataArrived) {
      reset(sanitizedInitialValues);
      if (justOpened) {
        resetStep();
      }
    }
  }, [isOpen, initialData, sanitizedInitialValues, reset, resetStep]);
    


  const resetForm = () => {
    reset(defaultValues);
    resetStep();
  };

  const submitProduct = (payload: CreateProductDto) =>
      isEditMode && initialData?.id
          ? update(Number(initialData.id), payload)
          : create(payload);

  const onFormSubmit = async (data: ProductFormData) => {


    try {
      const payload = buildProductPayload(data);
      console.log(payload)
      const success = await submitProduct(payload);

      if (success) {
        resetForm();
        closeModal?.();
      }
    } catch (error: unknown) {

      const nameFields = langKeys.map(
        (lang) => `name.${lang}` as Path<ProductFormInput>
      );

      handleServerErrors(error, setError, [
        ...nameFields
      ]);
    }
  };

  return {
    methods,
    currentStep,
    nextStep,
    prevStep,
    onSubmit: handleSubmit(onFormSubmit),
    isLastStep,
    isSubmitting,
    resetForm,
    formError,
    isEditMode,
  };
};