import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { Button } from "@/shared/components/Button";

import { useCategoryStore } from "@/features/category/store/useCategoryStore";

import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { useProductStore } from "@/features/products/store/useProductStore";
import { ProductFormData, productSchema } from "@/features/products/schema/productSchema";
import { IProduct } from "@/features/products/types/types";

interface Props {
  product?: IProduct | null;
  onSuccess?: () => void;
  closeModal?: () => void;
}

const statusOptions = [
  { label: "🟢 Active", value: "active" },
  { label: "📦 Archived", value: "archived" },
  { label: "📝 Draft", value: "draft" },
];

export default function ProductForm({ product, onSuccess, closeModal }: Props) {
  const { addProduct, updateProduct, isLoading } = useProductStore();
  const { adminCategories, fetchAdminCategories } = useCategoryStore();
  const { show, hide } = useStatusStore.getState();


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

  useEffect(() => {
    if (product) {
        reset({
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
}, [product, reset]);
  
  // 🧠 Categories options
  const categoryOptions = adminCategories.map((cat) => ({
      label: cat.name,
      value: cat.id,
  }));

  useEffect(() => {
      fetchAdminCategories();
  }, []);
  
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

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="grid gap-5">

      <Input
        label="اسم المنتج"
        {...register("name")}
        error={errors.name?.message}
      />

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

      <Input
        label="Brand"
        {...register("brand")}
        error={errors.brand?.message}
      />

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

      <Textarea
        label="الوصف"
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="flex justify-end mb-5">
        <Button type="submit" isLoading={isLoading}>
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
