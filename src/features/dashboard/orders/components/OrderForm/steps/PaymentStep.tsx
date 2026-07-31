import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { type OrderInput } from "../../../schema/orderSchema";
import { CreditCard, Banknote, Wallet, CheckCircle2 } from "lucide-react";
import { usePaymentGatewayStore } from "@/features/dashboard/payment/store/usePaymentGatewayStore";

export default function PaymentStep() {
    const { getValues } = useFormContext<OrderInput>();
    const { register, watch, setValue, formState: { errors } } = useFormContext<OrderInput>();
    const selectedMethod = watch("payment_method");

    const { gateways, fetchActiveGateways } = usePaymentGatewayStore();

    useEffect(() => {fetchActiveGateways()}, [fetchActiveGateways]);

    const selectedMethodSlug = watch("payment_method");
    
    useEffect(() => {
        const currentTotal = getValues("sub_total") + getValues("shipping_cost");
        const selectedGateway = gateways.find(g => g.slug === selectedMethodSlug);
        const extra = Number(selectedGateway?.extra_fees || 0);

        setValue("total_amount", currentTotal + extra);
    }, [selectedMethodSlug, gateways, setValue, getValues]);

    const staticMethodsUI = [
        { 
            id: "cod", 
            label: "الدفع عند الاستلام (COD)", 
            description: "ادفع نقداً للمندوب فور وصول طلبك",
            icon: <Banknote size={24} className="text-green-600 dark:text-green-400" /> 
        },
        { 
            id: "paymob",
            label: "بطاقة ائتمان / خصم", 
            description: "دفع آمن عبر فيزا أو ماستر كارد",
            icon: <CreditCard size={24} className="text-blue-600 dark:text-blue-400" /> 
        },

    ];

    const finalPaymentMethods = gateways.map(gateway => {
        const uiConfig = staticMethodsUI.find(m => m.id === gateway.slug);

        return {
            ...gateway,
            displayLabel: uiConfig ? uiConfig.label : gateway.name,
            displayDesc: uiConfig ? uiConfig.description : (gateway.description || "وسيلة دفع آمنة"),
            displayIcon: uiConfig ? uiConfig.icon : <CreditCard size={24} />
        };
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b dark:border-gray-700 pb-2 flex justify-between items-center">
                <h3 className="text-lg font-bold dark:text-white">طريقة الدفع</h3>
                {selectedMethod && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> تم الاختيار
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* التغيير هنا: نستخدم finalPaymentMethods بدلاً من methods */}
                {finalPaymentMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`group relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedMethod === method.slug // نستخدم الـ slug للقيمة
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-600" 
                            : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg shadow-sm transition-colors ${
                                selectedMethod === method.slug 
                                ? "bg-white dark:bg-gray-800" 
                                : "bg-gray-100 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-700"
                            }`}>
                                {method.displayIcon}
                            </div>
                            <div className="flex flex-col text-right"> {/* أضفت text-right للاتساق العربي */}
                                <span className={`font-bold ${
                                    selectedMethod === method.slug 
                                    ? "text-blue-900 dark:text-blue-100" 
                                    : "text-gray-700 dark:text-gray-300"
                                }`}>
                                    {method.displayLabel}
                                    {method.extra_fees > 0 && (
                                        <span className="mr-2 text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                                            +{method.extra_fees} ج.م
                                        </span>
                                    )}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {method.displayDesc}
                                </span>
                            </div>
                        </div>
                        
                        <input
                            type="radio"
                            value={method.slug} // نرسل الـ slug للسيرفر عند إرسال الطلب
                            {...register("payment_method")}
                            className="w-5 h-5 accent-blue-600 dark:accent-blue-500 cursor-pointer"
                        />
                    </label>
                ))}
            </div>

            {/* Validation Error */}
            {errors.payment_method && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">
                    {errors.payment_method.message}
                </p>
            )}

            {/* Contextual Note: Card/Wallet */}
            {selectedMethod && selectedMethod !== "cod" && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg text-sm border border-amber-200 dark:border-amber-900/30 flex gap-3 items-start animate-in zoom-in-95">
                    <span className="text-lg">💳</span>
                    <div>
                        <p className="font-bold mb-1">سيتم توجيهك لبوابة الدفع</p>
                        <p className="opacity-90">بعد الضغط على "تأكيد الطلب"، ستنتقل إلى صفحة الدفع الآمنة لإتمام العملية.</p>
                    </div>
                </div>
            )}

            {/* Contextual Note: COD */}
            {selectedMethod === "cod" && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg text-sm border border-green-200 dark:border-green-900/30 flex gap-3 items-start animate-in zoom-in-95">
                    <span className="text-lg">🚚</span>
                    <div>
                        <p className="font-bold mb-1">جاهز للتوصيل!</p>
                        <p className="opacity-90">سيقوم مندوبنا بالتواصل معك هاتفياً قبل موعد التسليم بـ 30 دقيقة.</p>
                    </div>
                </div>
            )}
        </div>
    );
}