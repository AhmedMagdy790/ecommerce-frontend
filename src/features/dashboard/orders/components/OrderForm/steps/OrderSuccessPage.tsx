import React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, Truck, PhoneCall, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
    const { orderId } = useParams(); // سنأخذ رقم الطلب من الرابط بعد تسجيله

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                
                {/* الجزء العلوي - أيقونة النجاح */}
                <div className="bg-indigo-600 p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 animate-bounce">
                            <CheckCircle2 className="text-white size-12" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                            تم استلام طلبك!
                        </h2>
                        <p className="text-indigo-100 text-sm mt-2 opacity-90">
                            رقم الطلب: <span className="font-mono font-bold">#{orderId || "7845"}</span>
                        </p>
                    </div>
                </div>

                {/* محتوى البطاقة */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="bg-slate-100 p-2 rounded-lg shrink-0">
                                <Truck className="text-slate-600 size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">جاري التجهيز للشحن</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                    سيتم مراجعة طلبك وتجهيزه خلال 24 ساعة عمل.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-slate-100 p-2 rounded-lg shrink-0">
                                <PhoneCall className="text-slate-600 size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">تأكيد هاتفي</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                    سيتواصل معك أحد موظفينا لتأكيد موعد التسجيل.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mb-4">
                            شكراً لثقتك بنا
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <Link 
                                to="/dashboard/orders" 
                                className="flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all"
                            >
                                <ShoppingBag size={16} />
                                متابعة طلبي
                            </Link>
                            <Link 
                                to="/" 
                                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all"
                            >
                                المتجر
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}