import React, { useState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Layers } from "lucide-react"; // أيقونات اختيارية

import BaseModal from "@/shared/components/BaseModal";
import { Button } from "@/shared/components/Button";
import ProductForm from "./ProductForm";
import VariantItem from "./VariantItem";
import { useProductStore } from "@/features/products/store/useProductStore";
import { productSchema } from "@/features/products/schema/productSchema";

export default function BaseModalProduct({ isOpen, closeModal, product }: any) {
  const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");
  const { addProduct, updateProduct, isLoading } = useProductStore();
  const formRef = useRef<HTMLFormElement>(null);

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category_id: undefined,
      status: "active",
      variants: []
    }
  });

  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({ ...product, variants: product.variants || [] });
      } else {
        reset({ name: "", variants: [] });
      }
      setActiveTab("basic");
    }
  }, [product, isOpen, reset]);

  const onSubmit = async (data: any) => {

    const success = product 
      ? await updateProduct(product.id, data) 
      : await addProduct(data);
    
    if (success) closeModal();
  };



  const ActionButtons = () => (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button type="button" variant="secondary" onClick={closeModal} className="px-6">
        {lang === "ar" ? "إلغاء" : "Cancel"}
      </Button>
      <Button
        type="button"
        variant="primary"
        className="px-6 shadow-theme-md"
        isLoading={isLoading}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {variant
          ? (lang === "ar" ? "تحديث المتغير" : "Update Variant")
          : (lang === "ar" ? "إنشاء متغير" : "Create Variant")}
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      closeModal={closeModal}
      maxWidth = "max-w-xl"
      title={product ? "تعديل المنتج" : "إضافة منتج"}
      action={ActionButtons}
    >
      <FormProvider {...methods}>
        {/* 📋 Tabs Header */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "basic" ? "border-primary text-primary" : "border-transparent text-main-text"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            <Package size={18} /> البيانات الأساسية
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "variants" ? "border-primary text-primary" : "border-transparent text-main-text"
            }`}
            onClick={() => setActiveTab("variants")}
          >
            <Layers size={18} /> المتغيرات ({fields.length})
          </button>
        </div>

        {/* 🧱 Tabs Content */}
        <div className="min-h-[400px]">
          {/* {activeTab === "basic" && (
          )} */}
            <div className={`${activeTab === "basic" ? "" : "hidden"} animate-in fade-in duration-300`}>
              <ProductForm closeModal={closeModal} />
            </div>

          {/* {activeTab === "variants" && (
          )} */}
            <div className={`${activeTab === "variants" ? "" : "hidden"} animate-in fade-in duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-theme-xl font-bold text-main-text tracking-tight border-e-4 border-brand-500 pe-3">
                  قائمة المتغيرات
                </h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => append({ sku: "", price: 0, stock: 0, status: "active", attributes: {} })}
                >
                  + إضافة متغير
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg text-gray-400">
                  لا يوجد متغيرات مضافة لهذا المنتج
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <VariantItem key={field.id} index={index} remove={remove} />
                  ))}
                </div>
              )}
            </div>
        </div>
      </FormProvider>
    </BaseModal>
  );
}