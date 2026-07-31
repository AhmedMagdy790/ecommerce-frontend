import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderFormData } from "../../schema/orderSchema";
import { useOrderSetpsStore } from "../../store/useOrderStepsStore";
import { useNavigate } from "react-router-dom"; // أضفنا هذا السطر

// Steps Components
import ShippingStep from "./steps/ShippingStep";
import CourierStep from "./steps/CourierStep";
import PaymentStep from "./steps/PaymentStep";
import SummaryStep from "./steps/SummaryStep";
import ProductsStep from "./steps/ProductsStep";
import OrderSuccessPage from "./steps/OrderSuccessPage";

import BaseModal from "@/shared/components/BaseModal";
import { Button } from "@/shared/components/Button";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { useOrderStore } from "../../store/useOrderStore";
import { type IOrder } from "../../types/types";

export default function OrderFormWizard(
    { isOpen, closeModal, selectOrder }: 
    { isOpen: boolean; closeModal: () => void, selectOrder?: IOrder | null }
) {
    const navigate = useNavigate(); // تعريف الـ navigate
    const { currentStep, nextStep, prevStep, formData, updateFormData, resetOrderForm } = useOrderSetpsStore();
    const { show, hide } = useStatusStore();
    const { addOrder } = useOrderStore();

    const methods = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        mode: "onChange",
        defaultValues: {
            customer_name: "",
            phone_primary: "",
            phone_secondary: "",
            shipping_address: "",
            items: [],
            payment_method: "cod",
            ...formData,
        },
    });


    const { handleSubmit, trigger, reset, formState: { isSubmitting } } = methods;

    console.log("selectOrder?.items", selectOrder?.items)

    useEffect(() => {
        if (isOpen) {
            if (selectOrder) {
                reset({
                    // بيانات العميل
                    customer_id: selectOrder.user?.id || null,
                    customer_name: selectOrder.customer_name || "",
                    phone_primary: selectOrder.phone_primary || "",
                    phone_secondary: selectOrder.phone_secondary || "",

                    shipping_cost: selectOrder.amounts?.shipping_cost || 0,
                    sub_total: selectOrder.amounts?.sub_total || 0,

                    shipping_address: selectOrder.shipping?.address || "",
   
                    city_id: selectOrder.city?.id || null, 
                    country_id: selectOrder.city?.country?.id || null,
                    shipping_courier_id: selectOrder.shipping?.courier_id || null,

                    // الدفع
                    payment_method: selectOrder.payment_method || 'cod',


                    items: selectOrder?.items?.map(item => ({
                        product_variant_id: Number(item.product_variant_id),
                        quantity: Number(item.quantity),
                        price: Number(item.price),

                        weight: Number(item.weight) > 0 ? Number(item.weight) : 0.5, 
                        length: Number(item.length) > 0 ? Number(item.length) : 10,
                        width: Number(item.width) > 0 ? Number(item.width) : 10,
                        height: Number(item.height) > 0 ? Number(item.height) : 5,
                    })) || [],


                    // ملاحظات
                    notes: selectOrder.notes || "",
                    coupon_code: selectOrder.coupon_code || ""
                });
            } else {
                // حالة إضافة طلب جديد (إعادة تعيين القيم للوضع الافتراضي)
                reset({
                    customer_id: null,
                    customer_name: "",
                    phone_primary: "",
                    shipping_address: "",
                    city_id: null,
                    country_id: null,
                    payment_method: 'cod',
                    items: [],
                    notes: ""
                });
            }
        }
    }, [selectOrder, isOpen, reset]);

    const handleNext = async () => {
        const fieldsByStep: (keyof OrderFormData)[][] = [
            ["customer_name", "phone_primary", "country_id", "city_id", "shipping_address"], 
            ["items"],                                             
            ["shipping_courier_id"],                               
            ["payment_method"],
            [],                                    
        ];

        const isStepValid = await trigger(fieldsByStep[currentStep]);

        
        if (isStepValid) {
            updateFormData(methods.getValues());
            nextStep();
        }
    };

    const onSubmit = async (data: OrderFormData) => {
        try {
            show("loading", "جاري إرسال طلبك...");
            
            const order = await addOrder(data);
            
            show("success", "تم تسجيل طلبك بنجاح!");

            setTimeout(() => {
                hide();
  
                navigate(`/dashboard/orders/success/${order.order_number}`);

                resetOrderForm();
                methods.reset();
                closeModal();
            }, 1500);

        } catch (error: any) {

            const message = error.response?.data?.message || "حدث خطأ أثناء معالجة الطلب";
            show("error", message);
            setTimeout(() => hide(), 3000);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <ShippingStep onNext={handleNext} />;
            case 1: return <ProductsStep onNext={handleNext} onBack={prevStep} />;
            case 2: return <CourierStep onNext={handleNext} onBack={prevStep} />;
            case 3: return <PaymentStep onNext={handleNext} onBack={prevStep} />;
            case 4: return <SummaryStep onBack={prevStep} />;
            case 5: return <OrderSuccessPage />;
            default: return null;
        }
    };

    const totalSteps = 5;

    return (
        <BaseModal
            isOpen={isOpen}
            maxWidth="max-w-4xl" // تم تعديلها لتكون متناسبة
            closeModal={closeModal}
            title="إتمام الطلب الجديد"
            description={currentStep < 5 ? `الخطوة ${currentStep + 1} من ${totalSteps}` : "اكتمل الطلب"}
            action={
                currentStep < 5 && ( // إخفاء الأزرار في حالة ظهور صفحة النجاح داخل المودال (اختياري)
                    <div className="flex gap-3 w-full justify-end">
                        {currentStep > 0 && currentStep < 5 && (
                            <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                                السابق
                            </Button>
                        )}
                        
                        {currentStep < totalSteps - 1 ? (
                            <Button onClick={handleNext}>التالي</Button>
                        ) : (
                            <Button 
                                onClick={handleSubmit(onSubmit)} 
                                isLoading={isSubmitting}
                                variant="primary"
                            >
                                تأكيد الطلب النهائي
                            </Button>
                        )}
                    </div>
                )
            }
        >
            <FormProvider {...methods}>
                <form className="min-h-[450px] flex flex-col justify-between">
                    <div className="flex-1">
                        {renderStep()}
                    </div>
                </form>
            </FormProvider>
        </BaseModal>
    );
}