import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, User, Package, Truck, CreditCard, Notebook, CheckCircle2 } from "lucide-react";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";
import type { OrderFormData } from "../../../schema/orderSchema";

export default function SummaryStep() {
    const { getValues } = useFormContext<OrderFormData>();
    const formData = getValues();
    const { cities, shippingOptions } = useCityStore();

    console.log("formData", formData)

    const cityName = useMemo(() => 
        cities.find(c => c.id === formData.city_id)?.name['ar'] || "غير محدد", 
    [formData.city_id, cities]);

    const courierName = useMemo(() => 
        shippingOptions.find(s => s.id === formData.shipping_courier_id)?.name || "غير محدد", 
    [formData.shipping_courier_id, shippingOptions]);

    const finalTotal = (formData.sub_total || 0) + (formData.shipping_cost || 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-main-text">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-main-border pb-4">
                <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full">
                    <CheckCircle2 className="text-success-600 dark:text-success-400 size-6" />
                </div>
                <h3 className="text-title-sm font-bold">مراجعة تفاصيل الطلب النهائية</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Customer Info */}
                <section className="bg-main-bg p-6 rounded-2xl border border-main-border shadow-theme-sm hover:border-primary transition-colors">
                    <div className="flex items-center gap-2 mb-5 font-bold">
                        <User size={18} className="text-primary" />
                        <h4>بيانات العميل والشحن</h4>
                    </div>
                    <div className="text-theme-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">الاسم:</span>
                            <span className="font-semibold">{formData.customer_name || "عميل زائر"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">الهاتف الأساسي:</span>
                            <span className="font-semibold font-mono tracking-wider" dir="ltr">{formData.phone_primary}</span>
                        </div>
                        <div className="pt-3 border-t border-main-border">
                            <span className="text-gray-400 flex items-center gap-1 mb-2 text-theme-xs uppercase font-bold">
                                <MapPin size={12}/> عنوان التوصيل
                            </span>
                            <p className="font-medium leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl text-gray-600 dark:text-gray-300 border border-main-border">
                                {cityName} - {formData.shipping_address}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Shipping & Payment */}
                <section className="bg-main-bg p-6 rounded-2xl border border-main-border shadow-theme-sm hover:border-primary transition-colors">
                    <div className="flex items-center gap-2 mb-5 font-bold">
                        <Truck size={18} className="text-primary" />
                        <h4>التوصيل والدفع</h4>
                    </div>
                    <div className="text-theme-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">شركة الشحن:</span>
                            <span className="font-bold text-primary bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-lg">{courierName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">طريقة الدفع:</span>
                            <span className={`px-3 py-1 rounded-lg text-theme-xs font-bold border ${
                                formData.payment_method === 'cod' 
                                ? 'bg-warning-50 text-warning-700 border-warning-100 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-900/30' 
                                : 'bg-success-50 text-success-700 border-success-100 dark:bg-success-900/20 dark:text-success-400 dark:border-success-900/30'
                            }`}>
                                <div className="flex items-center gap-1">
                                    <CreditCard size={12} />
                                    {formData.payment_method === 'cod' ? 'دفع عند الاستلام' : 
                                     formData.payment_method === 'card' ? 'بطاقة ائتمان' : 'محفظة إلكترونية'}
                                </div>
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            {/* 3. Products Table */}
            <section className="border border-main-border rounded-2xl overflow-hidden shadow-theme-sm bg-main-bg">
                <div className="bg-gray-50/80 dark:bg-gray-900/50 p-4 font-bold flex items-center gap-2 text-theme-sm border-b border-main-border">
                    <Package size={18} className="text-gray-400" />
                    منتجات الطلب 
                    <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-[10px] ml-1">
                        {formData.items?.length || 0}
                    </span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-right text-theme-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                            <tr className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-main-border">
                                <th className="p-4 font-semibold text-right">المنتج</th>
                                <th className="p-4 text-center font-semibold">الكمية</th>
                                <th className="p-4 text-left font-semibold">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-main-border">
                            {formData.items?.map((item, index) => (
                                <tr key={index} className="hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold group-hover:text-primary">{item.name}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">{item.price} EGP للقطعة</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md font-bold text-xs">
                                            ×{item.quantity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-left font-bold">
                                        {(Number(item.price) * Number(item.quantity)).toFixed(2)} <span className="text-[10px] text-gray-400">EGP</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 4. Notes & Financial Summary */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="flex-1 w-full">
                    {formData.notes ? (
                        <div className="bg-warning-50/40 dark:bg-warning-900/10 p-5 rounded-2xl border border-warning-100/50 dark:border-warning-900/30 flex gap-4 h-full">
                            <Notebook size={20} className="text-warning-500 shrink-0 mt-1" />
                            <div>
                                <span className="block font-bold text-warning-900 dark:text-warning-200 text-xs mb-1 uppercase tracking-wider">ملاحظات العميل</span>
                                <p className="text-warning-800/80 dark:text-warning-300/80 text-sm italic leading-relaxed">"{formData.notes}"</p>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-main-border p-5 rounded-2xl text-center text-gray-400 text-sm h-full flex items-center justify-center italic">
                            لا توجد ملاحظات إضافية على هذا الطلب
                        </div>
                    )}
                </div>

                {/* Total Section - Always dark-styled for contrast */}
                <section className="w-full md:w-[380px] bg-gray-950 text-white p-8 rounded-[2rem] shadow-theme-xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/20 transition-colors"></div>
                    
                    <div className="space-y-5 relative z-10">
                        <div className="flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span>إجمالي المنتجات</span>
                            <span className="font-mono text-gray-200">{formData?.sub_total?.toFixed(2)} EGP</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span>تكلفة الشحن ({cityName})</span>
                            <span className="font-mono text-gray-200">{formData?.shipping_cost?.toFixed(2)} EGP</span>
                        </div>
                        
                        <div className="border-t border-white/10 pt-6 mt-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-brand-400 font-black uppercase tracking-widest block">المبلغ الإجمالي</span>
                                    <span className="text-theme-xl font-bold text-white">المطلوب سداده</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-title-md font-black font-mono text-white tracking-tighter">
                                        {finalTotal.toFixed(2)} 
                                        <span className="text-xs ml-1 text-gray-400 font-normal">EGP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 text-[9px] text-gray-500 text-center uppercase tracking-[0.2em]">
                        جميع الحقوق محفوظة © {new Date().getFullYear()}
                    </div>
                </section>
            </div>
        </div>
    );
}