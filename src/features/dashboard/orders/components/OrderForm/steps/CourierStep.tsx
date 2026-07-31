import React, { useEffect, useMemo, useCallback } from "react";
import { Truck, Check, Timer, Info, AlertCircle } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import CustomSelect from "@/shared/components/CustomSelect";
import { type OrderInput } from "@/features/dashboard/orders/schema/orderSchema";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";

interface IStepProps {
    onNext: () => void;
    onBack: () => void;
}

const formatOptionLabel = (option: any) => (
    <div className="flex justify-between items-center w-full py-1">
        <div className="flex flex-col">
            <span className={`font-bold ${option.isDisabled ? 'text-gray-400' : 'text-main-text'}`}>
                {option.name}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                يصل خلال {option.deliveryDays} أيام
            </span>
        </div>
        
        <div className="text-left">
            {option.isDisabled ? (
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    تجاوز الوزن/الحجم
                </span>
            ) : (
                <span className={`font-black ${option.isFree ? 'text-success-600' : 'text-primary'}`}>
                    {option.isFree ? 'شحن مجاني' : `${option.fee} EGP`}
                </span>
            )}
        </div>
    </div>
);

export default function CourierStep({ onNext, onBack }: IStepProps) {
    const {
        control,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<OrderInput>();

    const { shippingOptions, fetchShippingMethods, loading } = useCityStore();

    const selectedCityId = watch("city_id");
    const selectedCourierId = watch("shipping_courier_id");
    const selectedShippingCost = watch("shipping_cost");
    const subTotal = watch("sub_total");

    const cartItems = watch("items");

    const totalWeight = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            // نستخدم القيم التي تأكدنا الآن من وجودها
            const weight = Number(item.weight || 0);
            const qty = Number(item.quantity || 1);
            return acc + (weight * qty);
        }, 0);
    }, [cartItems]);

    // تحديث القيمة في الفورم ليراها الباك-أند
    useEffect(() => {
        setValue("total_weight", totalWeight);
    }, [totalWeight, setValue]);



    const orderDimensions = useMemo(() => ({
        maxLength: Math.max(0, ...cartItems.map(i => Number(i.length || 0))),
        maxWidth: Math.max(0, ...cartItems.map(i => Number(i.width || 0))),
        maxHeight: Math.max(0, ...cartItems.map(i => Number(i.height || 0))),
    }), [cartItems]);


    const volumetricWeight =
        (orderDimensions.maxLength *
        orderDimensions.maxWidth *
        orderDimensions.maxHeight) / 5000;

    const finalShippingWeight = Math.max(
        totalWeight,
        volumetricWeight
    );

    useEffect(() => {
        setValue("total_weight", finalShippingWeight);

        setValue("total_height", orderDimensions.maxHeight);
        setValue("total_width", orderDimensions.maxWidth);
        setValue("total_length", orderDimensions.maxLength);
    }, [finalShippingWeight, orderDimensions, setValue]);

    useEffect(() => {
        const currentSubTotal = Number(getValues("sub_total") || 0);
        const shipping = Number(selectedShippingCost || 0);
        const discount = Number(getValues("discount_amount") || 0);

        setValue(
            "total_amount",
            currentSubTotal + shipping - discount,
            { shouldValidate: true }
        );
    }, [selectedShippingCost, subTotal, getValues, setValue]);

    // إعادة ضبط الشحن عند تغيير المدينة
    useEffect(() => {
        if (selectedCityId) {
            setValue('shipping_courier_id', 0);
            setValue('shipping_cost', 0);
            fetchShippingMethods(selectedCityId);
        }
    }, [selectedCityId, fetchShippingMethods, setValue]);

    const orderMaxDimension = Math.max(
        orderDimensions.maxHeight,
        orderDimensions.maxWidth,
        orderDimensions.maxLength
    );

    const courierOptions = useMemo(() => {
        return shippingOptions.map((item) => {
            const details = item.shipping_details || {};

            const baseFee = Number(details.shipping_fee || 0);
            const threshold = Number(details.free_shipping_threshold || 0);

            const maxWeight = Number(details.max_weight || 0);
            const maxSize = Number(details.max_height || 0);

            const baseWeight = Number(details.base_weight || 0);
            const extraPerKg = Number(details.extra_per_kg || 0);

            const isOverSize =
                maxSize > 0 &&
                orderMaxDimension > maxSize;

            const isOverWeight =
                maxWeight > 0 &&
                finalShippingWeight > maxWeight;

            const isDisabled = isOverWeight || isOverSize;

            const extraWeight =
                finalShippingWeight > baseWeight
                    ? finalShippingWeight - baseWeight
                    : 0;

            const dynamicFee =
                baseFee + extraWeight * extraPerKg;

            const isFree =
                threshold > 0 &&
                subTotal >= threshold;

            const finalFee = isFree ? 0 : dynamicFee;

            return {
                value: item.id,
                disabled: isDisabled,
                // البيانات التي سنستخدمها في التصميم المخصص
                name: item.name,
                fee: finalFee,
                isFree: isFree,
                deliveryDays: details.delivery_days,
                isDisabled: isDisabled,
                // الـ label يظل نصياً للبحث والتوافق (Fallback)
                label: `${item.name} - ${finalFee} EGP`, 
            };
        });
    }, [
        shippingOptions,
        subTotal,
        finalShippingWeight,
        orderMaxDimension,
        orderDimensions.maxHeight,
        orderDimensions.maxWidth,
        orderDimensions.maxLength,
    ]);

    const handleCourierChange = useCallback((id: number | string) => {
        const courierId = Number(id);
        setValue('shipping_courier_id', courierId, { shouldValidate: true });

        const selectedOption = courierOptions.find(opt => opt.value === courierId);
        if (selectedOption) {
            setValue('shipping_cost', selectedOption.fee, { shouldValidate: true });
        } else {
            setValue('shipping_cost', 0);
        }
    }, [courierOptions, setValue]);

    const currentCourier = courierOptions.find(o => o.value === selectedCourierId);


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 rtl text-main-text">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-main-border pb-4 transition-colors">
                <div className="p-2 bg-brand-500/10 dark:bg-brand-400/10 rounded-lg">
                    <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">طريقة التوصيل</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">اختر شركة الشحن المناسبة لك</p>
                </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-light-50/50 dark:bg-blue-light-900/10 border border-blue-light-100 dark:border-blue-light-800 rounded-xl transition-colors">
                <Info className="w-5 h-5 text-blue-light-600 dark:text-blue-light-400 mt-0.5" />
                <p className="text-sm text-blue-light-700 dark:text-blue-light-300 leading-relaxed">
                    تعتمد تكلفة ومدة الشحن على موقعك الجغرافي. يرجى اختيار الشركة المفضلة لعرض السعر النهائي.
                </p>
            </div>

            {/* Selection Area */}
            <div className="space-y-4">
               <Controller
                name="shipping_courier_id"
                control={control}
                render={({ field }) => (
                    <CustomSelect
                    label="شركة الشحن"
                    value={field.value}
                    options={courierOptions} // تأكد أن courierOptions تحتوي على disabled و fee و deliveryDays
                    onChange={handleCourierChange}
                    error={errors.shipping_courier_id?.message}
                    renderOption={(option) => (
                        <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{option.name}</span>
                            <span className="text-[10px] text-gray-500">يصل خلال {option.deliveryDays} أيام</span>
                        </div>
                        <div className="text-left">
                            {option.disabled ? (
                                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                    غير متاح
                                </span>
                            ) : (
                                <span className="text-xs font-black text-blue-600">
                                    {option.fee === 0 ? "مجاني" : `${option.fee} EGP`}
                                </span>
                            )}
                        </div>
                        </div>
                    )}
                    />
                )}
                />

                {/* Empty State */}
                {!loading && selectedCityId && courierOptions.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-main-border rounded-2xl text-center bg-gray-50/30 dark:bg-gray-900/20 transition-colors">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">عذراً، لا تتوفر شركات شحن لمدينتك حالياً</p>
                    </div>
                )}
            </div>

            {/* Selected Courier Summary Card */}
            {selectedCourierId > 0 && !loading && (
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 dark:bg-black p-6 text-white shadow-theme-lg transition-all border border-white/5">
                    {/* Background Decoration */}
                    <Truck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12 pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="px-3 py-1 bg-brand-500/20 border border-brand-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-300">
                                خيار الشحن المحدد
                            </span>
                            <div className="flex items-center gap-1 text-gray-400">
                                <Timer className="w-4 h-4" />
                                <span className="text-xs font-medium">
                                    يصل خلال {currentCourier?.deliveryDays || 2} أيام
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end gap-2">
                            <div>
                                <p className="text-gray-400 text-xs mb-1 font-medium">تكلفة التوصيل</p>
                                <h4 className="text-3xl font-black">
                                    {selectedShippingCost === 0 ? (
                                        <span className="text-success-400 italic">FREE</span>
                                    ) : (
                                        <>
                                            {selectedShippingCost} 
                                            <span className="text-sm font-normal text-gray-400 mr-1 italic">EGP</span>
                                        </>
                                    )}
                                </h4>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/10 shrink-0">
                                <Check className="w-4 h-4 text-success-400" />
                                <span className="text-xs font-bold truncate max-w-[120px]">
                                    {shippingOptions.find(s => s.id === selectedCourierId)?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}