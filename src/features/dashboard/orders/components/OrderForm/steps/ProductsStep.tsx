import React, { useEffect, useMemo } from "react";
import { useFormContext, useFieldArray, useWatch, Controller } from "react-hook-form";
import { type OrderInput } from "../../../schema/orderSchema";
import CustomSelect from "@/shared/components/CustomSelect";
import { Trash2 } from "lucide-react";
import { useProductStore } from "@/features/dashboard/products/store/useProductStore";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { InputNumber } from "@/shared/components/InputNumber";

interface IStepProps {
    onNext: () => void;
    onBack: () => void;
}

export default function ProductsStep({ onNext, onBack }: IStepProps) {
    const { control, register, watch, setValue, formState: { errors } } = useFormContext<OrderInput>();
    const { fetchPublicProducts, products } = useProductStore();
    const { show } = useStatusStore(); // To alert user about stock issues

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });


    useEffect(() => {
        fetchPublicProducts();
    }, [fetchPublicProducts]);



    const watchedItems = useWatch({
        control,
        name: "items",
    }) || [];

    const subTotal = useMemo(() => {
        const currentItems = watchedItems || [];
        return currentItems.reduce((sum, item) => {
            const price = parseFloat(item?.price) || 0;
            const quantity = parseInt(item?.quantity) || 0;
            return sum + (price * quantity);
        }, 0);
    }, [watchedItems]);

    const totalWeight = useMemo(() => {
        const currentItems = watchedItems || [];
        return currentItems.reduce((sum, item) => {
            return sum + (Number(item?.weight || 0) * Number(item?.quantity || 0));
        }, 0);
    }, [watchedItems]);
        


    useEffect(() => {
        setValue("sub_total", subTotal);
    }, [subTotal, setValue]);



// في مكون ProductsStep
    const selectOption = useMemo(() => {
        if (!products) return [];
        
        return products.flatMap((product) => 
            product.variants.map((variant) => {
            
                const attrString = variant.attributes && typeof variant.attributes === 'object'
                    ? Object.values(variant.attributes).join("/")
                    : "";

                return {
                    label: `${product.name} ${attrString ? `- ${attrString}` : ""}`,
                    value: variant.id,
                    raw: {
                        ...variant,
                        product_name: product.name,
                        variant_info: attrString
                    },
                   
                    subLabel: `Price: ${variant.price} EGP | Stock: ${variant.stock}`
                };
            })
        );
    }, [products]);

    const handleAddProduct = (variantId: string) => {
        if (!variantId) return;

        const selected = selectOption.find(opt => opt.value === variantId);

        if (!selected) return;
        
        const item = selected.raw;

  
        if(item.stock <= 0) {
            show("error", "لا يوجد شي في المخزون", "full", true);
            return;
        }

        
        const existingIndex = fields.findIndex(
            (field) => Number(field.product_variant_id) === Number(item.id)
        );
        

        if (existingIndex > -1) {
  
            const currentQty = watch(`items.${existingIndex}.quantity`) || 0;
 
            if (currentQty >= item.stock) {
                show("error", `لا يمكن إضافة المزيد، المخزون المتاح هو ${item.stock} فقط`);
            } else {

                setValue(`items.${existingIndex}.quantity`, currentQty + 1);
            }
        } else {
  
    
            append({
                product_variant_id: Number(item.id),
                quantity: 1,
                price: Number(item.price),
                max_stock: item.stock,
                // إذا كان الوزن من السيرفر 0، نعطيه قيمة افتراضية مثل 0.5 كيلو
                weight: Number(item.weight) > 0 ? Number(item.weight) : 0.5, 
                length: Number(item.length) > 0 ? Number(item.length) : 10,
                width: Number(item.width) > 0 ? Number(item.width) : 10,
                height: Number(item.height) > 0 ? Number(item.height) : 5,
            });


        }

        setValue("temp_product", "");
    };


    console.log("error", errors)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold border-b pb-2">إضافة المنتجات للطلب</h3>

            <div className="p-4 rounded-lg border border-dashed border-main-border bg-gray-50/50">
               <CustomSelect
                    label="البحث عن منتج"
                    name="temp_product"
                    options={selectOption}
                    onChange={(val) => handleAddProduct(val)}
                    placeholder="ابحث باسم المنتج..."
                    value={watch("temp_product")}
                />
                
            </div>

            <div className="table-container">
                <table className="table-main">
                    <thead className="table-head">
                        <tr>
                            <th className="table-th">المنتج</th>
                            <th className="table-th">الكمية</th>
                            <th className="table-th">السعر</th>
                            <th className="table-th">الإجمالي</th>
                            <th className="table-th">حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <tr key={field.id} className="table-tr">
                                <td className="table-td">
                                    <div className="font-medium">{watchedItems[index]?.name}</div>
                                    <div className="text-xs text-gray-400">ID: {watchedItems[index]?.product_variant_id}</div>
                                </td>
                                <td className="table-td">
                                    <div className="min-w-[150px]">
                                   <Controller
                                        control={control}
                                        name={`items.${index}.quantity`}
                                        render={({ field, fieldState }) => (
                                            <InputNumber
                                                label="الكمية"
                                                min={0}
                                             
                                                max={fields[index].max_stock} 
                                                step={1}
                                                value={field.value ?? ""}
                                                onValueChange={(val) => {
                                                  
                                                    if (val > (fields[index].max_stock || 999)) {
                                                        show("error", "الكمية المطلوبة تتجاوز المخزون", 'blur', true);
                                                        return;
                                                    }
                                                    field.onChange(val);
                                                }}
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                    </div>
                                </td>
                                <td className="table-td">
                                    {Number(watchedItems[index]?.price).toFixed(2)} EGP
                                </td>
                                <td className="table-td">
                                    {((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.price || 0)).toFixed(2)}
                                </td>
                                <td className="table-td">
                                    <button 
                                        type="button" 
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {fields.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        سلة المنتجات فارغة. ابحث عن منتج لإضافته.
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center p-5 bg-blue-50/50 border border-blue-100 rounded-lg">
                <span className="text-gray-700 font-medium">إجمالي المنتجات (قبل الشحن):</span>
                <span className="text-2xl font-black text-blue-700">{subTotal.toFixed(2)} EGP</span>
            </div>

            {errors.items && (
                <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded border border-red-100">
                    {errors.items.message}
                </p>
            )}
        </div>
    );
}