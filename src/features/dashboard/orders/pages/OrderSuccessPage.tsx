import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, Truck, CreditCard, ArrowRight } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore"; // تأكد من وجود دالة fetchOrderByNumber
import { type IOrder } from "../types/types";

export default function OrderSuccessPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // هنا يجب أن يكون لديك دالة في الـ Store لجلب طلب واحد عن طريق رقمه
        // مثال افتراضي:
        if (orderId) {
            // fetchOrderByNumber(orderId).then(res => { setOrder(res); setLoading(false); });
            // للتبسيط الآن سنفترض التحميل فقط
            setTimeout(() => setLoading(false), 1000);
        }
    }, [orderId]);

    if (loading) return <div className="p-20 text-center">جاري تحميل تفاصيل الطلب...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500">
            {/* رسالة النجاح */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold dark:text-white">شكراً لك! تم استلام طلبك</h1>
                <p className="text-gray-500">رقم الطلب الخاص بك هو <span className="font-mono font-bold text-gray-900 dark:text-gray-200">{orderId}</span></p>
            </div>

            {/* تفاصيل سريعة */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-brand-500">
                        <Truck size={20} />
                        <h3 className="font-bold">حالة التوصيل</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">سيتم معالجة طلبك وشحنه خلال 24 ساعة.</p>
                </div>

                <div className="p-4 border dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-blue-500">
                        <CreditCard size={20} />
                        <h3 className="font-bold">طريقة الدفع</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الدفع عند الاستلام (COD)</p>
                </div>
            </div>

            {/* زر العودة */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link to="/dashboard/orders" className="btn-primary flex items-center justify-center gap-2 px-8">
                    متابعة طلباتي
                </Link>
                <Link to="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition">
                    العودة للتسوق <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}