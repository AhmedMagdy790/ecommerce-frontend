import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "../schema/productSchema";
import { useProductStore } from "../store/useProductStore";

type InitialProductData = Partial<ProductFormData> & {
  id?: number | string;
  category?: { id: number | string }; 
  category_id?: number | string;
  variants?: Array<{
    id?: number | string;
    sku?: string;
    price?: number | string;
    stock?: number | string;
    status?: "active" | "inactive";
    attributes?:
      | Record<string, string>
      | Array<{ key: string; value: string }>
      | null;
  }>;
};

const defaultValues: ProductFormData = {
  id: undefined,
  name: "",
  description: "",
  status: "active",
  brand: "",
  category_id: "",
  variants: [],
  featured_image: null,
  gallery: [],
  remove_images: [],
};

function normalizeVariantAttributes(
  attributes:
    | Record<string, string>
    | Array<{ key: string; value: string }>
    | null
    | undefined
) {
  if (!attributes) return [];

  if (Array.isArray(attributes)) {
    return attributes.map(({ key, value }) => ({
      key: key ?? "",
      value: value ?? "",
    }));
  }

  return Object.entries(attributes).map(([key, value]) => ({
    key,
    value: value ?? "",
  }));
}


function transformVariantsForSubmit(
  variants: ProductFormData["variants"]
) {
  return variants.map((variant) => ({
    id: typeof variant.id === 'string' ? Number(variant.id) : variant.id,
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,
    status: variant.status,
    attributes: (variant.attributes || []).reduce((acc, item) => {
      const key = item.key?.trim();
      const value = item.value?.trim();

      if (!key || !value) return acc;

      // overwrite instead of silent ignore
      acc[key] = value;

      return acc;
    }, {} as Record<string, string>),
  }));
}


export const useProductForm = (
  initialData?: InitialProductData,
  closeModal?: () => void,
  isOpen?: boolean
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { addProduct, updateProduct } = useProductStore();

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { isSubmitting },
  } = methods;

  const isEditMode = !!initialData?.id;

  const sanitizedInitialValues = useMemo<ProductFormData>(() => {
    if (!initialData) return defaultValues;

    return {
      ...defaultValues,
      id: initialData.id,
      name: initialData.name || "",
      description: initialData.description || "",
      status: (initialData.status as ProductFormData["status"]) || "active",
      brand: initialData.brand || "",
      category_id: initialData.category?.id?.toString() || "",
      variants:
        initialData.variants?.map((variant) => ({
          id: variant.id,
          sku: variant.sku || "",
          price: Number(variant.price) || 0,
          stock: Number(variant.stock) || 0,
          status: variant.status || "active",
          attributes: normalizeVariantAttributes(variant.attributes),
        })) || [],
      featured_image: initialData.featured_image ?? null,
      gallery: initialData.gallery ?? [],
      remove_images: initialData.remove_images ?? [],
    };
  }, [initialData]);

  useEffect(() => {
    if (!isOpen) return;

    reset(sanitizedInitialValues);
    setCurrentStep(1);
  }, [isOpen, sanitizedInitialValues, reset]);



  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    let fieldsToValidate: (keyof ProductFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["name", "category_id", "brand", "status"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["variants"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onFormSubmit = async (data: ProductFormData) => {

    console.log("data", data)
    try {
      // 1. معالجة المتغيرات (Variants)
      const variants = transformVariantsForSubmit(data.variants || []);

      const newGalleryFiles = (data.gallery || []).filter(
        (item) => item instanceof File
      );

      const featuredImage = data.featured_image instanceof File ? data.featured_image : null;

      const payload: any = {
        name: data.name,
        description: data.description,
        brand: data.brand,
        category_id: Number(data.category_id),
        status: data.status,
        variants: variants,
        featured_image: featuredImage, // سيكون إما File أو null
        gallery: newGalleryFiles,      // مصفوفة تحتوي فقط على File[]
        remove_images: data.remove_images || [],
      };

      console.log("Clean Payload:", payload);

      let success = false;

      if (isEditMode && initialData?.id) {
        const idNum = typeof initialData.id === 'string' ? Number(initialData.id) : initialData.id;
        success = await updateProduct(idNum, payload);
      } else {
        success = await addProduct(payload);
      }

      if (success) {
        reset(defaultValues);
        setCurrentStep(1);
        closeModal?.();
      }
    } catch (error) {
      console.error("Product form submit error:", error);
    }
  };

  const resetForm = () => {
    reset(defaultValues);
    setCurrentStep(1);
  };

  return {
    methods,
    currentStep,
    nextStep,
    prevStep,
    onSubmit: handleSubmit(onFormSubmit),
    isLastStep: currentStep === 3,
    isSubmitting,
    resetForm,
    isEditMode,
  };
};