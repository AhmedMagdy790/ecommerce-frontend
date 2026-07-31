import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRightIcon, SaveIcon, CreditCardIcon, KeyIcon, InfoIcon, TagIcon } from "lucide-react";

import { useLang } from "@/shared/context/LanguageContext";
import { usePaymentGatewayStore } from "../store/usePaymentGatewayStore";
import { type IPaymentGatewayPayload } from "../types/types";
import { Input } from "@/shared/components/Input";
import { InputNumber } from "@/shared/components/InputNumber";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { Textarea } from "@/shared/components/Textarea";
import { Button } from "@/shared/components/Button";

export default function PaymentFormPage() {
    const { lang } = useLang();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);



    const { addGateway, updateGateway, getById, isLoading } = usePaymentGatewayStore();

    const { register, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm<IPaymentGatewayPayload>({
        defaultValues: {
            is_active: true,
            is_test_mode: true,
            extra_fees: 0,
            type: "online", // القيمة الافتراضية للنوع
            credentials: {}
        }
    });

    const selectedSlug = watch("slug");

 
   useEffect(() => {
        if (isEdit && id) {
            getById(Number(id)).then((gateway) => {
                console.log(gateway)
                if (gateway) {
                    setValue("name.ar", gateway.name?.ar || "");
                    setValue("name.en", gateway.name?.en || "");
                    setValue("description.ar", gateway.description?.ar || "");
                    setValue("description.en", gateway.description?.en || "");
                    setValue("slug", gateway.slug);
                    setValue("type", gateway.type || "online");
                    setValue("extra_fees", gateway.extra_fees ?? 0);
                    setValue("is_active", Boolean(gateway.is_active));
                    setValue("is_test_mode", Boolean(gateway.is_test_mode));

                    if (gateway.credentials) {
                        setValue("credentials.public_key", gateway.credentials.public_key || "");
                        setValue("credentials.secret_key", gateway.credentials.secret_key || "");
                        if ((gateway.credentials as any).integration_id) {
                            setValue("credentials.integration_id", (gateway.credentials as any).integration_id || "");
                        }
                    }
                }
            });
        }
    }, [isEdit, id, getById, setValue]);

    const onSubmit = async (data: IPaymentGatewayPayload) => {
        try {
            let success;
            if (isEdit && id) {
                success = await updateGateway(Number(id), data);
            } else {
                success = await addGateway(data);
            }
            if (success) navigate("/admin/payment-gateways");
        } catch(err) {
            handleServerErrors(err, setError, [
                "name",
                "slug",
                "type",
                "extra_fees",
                "is_active",
                "is_test_mode",
                "credentials",
            ]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 lg:p-8" style={{ fontFamily: "var(--font-outfit)" }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    >
                        <ArrowRightIcon className={`w-5 h-5 ${lang === 'ar' ? '' : 'rotate-180'}`} />
                        <span className="font-medium text-sm">{lang === "ar" ? "العودة" : "Back"}</span>
                    </button>
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isLoading}
                        leftIcon={<SaveIcon className="w-4 h-4" />}
                    >
                        {isLoading ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") : (lang === "ar" ? "حفظ الإعدادات" : "Save Settings")}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Main Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gateway Info */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-2xl)] shadow-sm border border-[var(--color-border)] space-y-5">
                            <h3 className="text-lg font-bold flex items-center gap-2.5 text-[var(--color-text-primary)]">
                                <div className="p-2 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
                                    <CreditCardIcon className="w-5 h-5 text-[var(--color-primary)]" />
                                </div>
                                {lang === "ar" ? "بيانات بوابة الدفع" : "Gateway Information"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="اسم البوابة (بالعربية)"
                                    placeholder="مثلاً: الدفع عند الاستلام"
                                    error={errors.name?.ar?.message}
                                    {...register("name.ar", { required: "الاسم بالعربية مطلوب" })}
                                />

                                <Input
                                    label="Gateway Name (EN)"
                                    placeholder="e.g. Cash on Delivery"
                                    error={errors.name?.en?.message}
                                    {...register("name.en", { required: "Name in English is required" })}
                                />
                            </div>

                            <div className="space-y-4">
                                <Textarea
                                    label="الوصف بالعربية"
                                    error={errors.description?.ar?.message}
                                    {...register("description.ar")}
                                />
                                <Textarea
                                    label="Description (EN)"
                                    error={errors.description?.en?.message}
                                    {...register("description.en")}
                                />
                            </div>

                            <Input
                                label={lang === "ar" ? "المعرف الفريد (Slug)" : "Unique Slug"}
                                placeholder="stripe_card"
                                disabled={isEdit}
                                error={errors.slug?.message}
                                {...register("slug", { required: "Slug is required" })}
                            />
                        </div>

                        {/* API Credentials */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-2xl)] shadow-sm border border-[var(--color-border)] space-y-5">
                            <h3 className="text-lg font-bold flex items-center gap-2.5 text-[var(--color-text-primary)]">
                                <div className="p-2 bg-amber-500/10 rounded-[var(--radius-xl)] border border-amber-500/20">
                                    <KeyIcon className="w-5 h-5 text-amber-500" />
                                </div>
                                {lang === "ar" ? "مفاتيح الربط (API Keys)" : "API Credentials"}
                            </h3>

                            <div className="grid gap-5">
                                <Input 
                                    label="Public Key / Merchant ID"
                                    placeholder="pk_test_..."
                                    error={(errors.credentials as any)?.public_key?.message}
                                    {...register("credentials.public_key")}
                                />
                                
                                <Input 
                                    label="Secret Key / API Key"
                                    type="password"
                                    placeholder="sk_test_..."
                                    error={(errors.credentials as any)?.secret_key?.message}
                                    {...register("credentials.secret_key")}
                                />

                                {selectedSlug?.includes('paymob') && (
                                    <Input 
                                        label="Integration ID"
                                        placeholder="123456"
                                        error={(errors.credentials as any)?.integration_id?.message}
                                        {...register("credentials.integration_id")}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <div className="space-y-6">
                        {/* Type & Classification */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-2xl)] shadow-sm border border-[var(--color-border)] space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
                                <TagIcon className="w-4 h-4 text-[var(--color-primary)]" />
                                {lang === "ar" ? "نوع البوابة" : "Gateway Type"}
                            </h3>
                            
                            <div>
                                <select 
                                    {...register("type", { required: "Type is required" })}
                                    className="w-full px-3 py-2 rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                >
                                    <option value="online">{lang === "ar" ? "إلكتروني (Online)" : "Online"}</option>
                                    <option value="offline">{lang === "ar" ? "يدوي / كاش (Offline)" : "Offline / Cash"}</option>
                                    <option value="wallet">{lang === "ar" ? "محفظة إلكترونية (Wallet)" : "Wallet"}</option>
                                </select>
                                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
                            </div>
                        </div>

                        {/* Status & Mode */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-2xl)] shadow-sm border border-[var(--color-border)] space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
                                <InfoIcon className="w-4 h-4 text-[var(--color-primary)]" />
                                {lang === "ar" ? "الحالة والنمط" : "Status & Mode"}
                            </h3>
                            
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all">
                                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{lang === "ar" ? "تفعيل البوابة" : "Active"}</span>
                                    <input type="checkbox" {...register("is_active")} className="w-5 h-5 accent-[var(--color-primary)] rounded-[var(--radius-sm)] cursor-pointer" />
                                </label>

                                <label className="flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-amber-500/5 cursor-pointer border border-amber-500/10 hover:border-amber-500/30 transition-all">
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{lang === "ar" ? "وضع الاختبار" : "Test Mode"}</span>
                                    <input type="checkbox" {...register("is_test_mode")} className="w-5 h-5 accent-amber-500 rounded-[var(--radius-sm)] cursor-pointer" />
                                </label>
                            </div>
                        </div>

                        {/* Fees */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-2xl)] shadow-sm border border-[var(--color-border)] space-y-3">
                            <InputNumber
                                label={lang === "ar" ? "رسوم إضافية (EGP)" : "Extra Fees (EGP)"}
                                min="0"
                                placeholder="0.00"
                                error={errors.extra_fees?.message}
                                value={watch('extra_fees')}
                                onValueChange={(val) => setValue('extra_fees', val)}
                            />
                            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed px-1">
                                {lang === "ar" 
                                    ? "* سيتم إضافة هذا المبلغ تلقائياً لإجمالي الفاتورة عند اختيار هذه البوابة." 
                                    : "* This amount will be added to the order total when this gateway is selected."}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}