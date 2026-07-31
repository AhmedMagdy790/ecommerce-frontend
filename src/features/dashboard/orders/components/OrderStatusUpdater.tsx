import React, { useState } from 'react';
import orderService from '../services/orderService';
import { confirm } from '@/shared/components/confirmModal/confirm';
import { useStatusStore } from '@/shared/components/StatusOverlay/statusStore';
import { handleServerErrors } from '@/shared/utils/handleServerError';

interface OrderStatusProps {
  orderId: number;
  currentStatus: string;
}

export const OrderStatusUpdater = ({ orderId, currentStatus }: OrderStatusProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const { show, hide } = useStatusStore.getState();

  const handleStatusChange = async (newStatus: any) => {
    const result = await confirm({
        title: "سوف يتم تغيير الحالة",
        description: "هل أنت متأكد من رغبتك في تعديل حالة هذا الطلب؟",
    });

    if (!result) return;

    setLoading(true);

    if (typeof show === 'function') {
      show("loading", "جاري تحديث حالة الطلب والمخزون...");
    }

    try {
      await orderService.updateStatus(orderId, newStatus);
      setStatus(newStatus);
      show("success", "تم تحديث حالة الطلب والمخزون بنجاح!");
    } catch (error) {
      const { status, message, errors } = handleServerErrors(error, null, [])

      show("error", errors?.order || message || "حدث خطأ أثناء التحديث، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        hide();
      }, 1500);
    }
  };

  //  تحديث ذكي للألوان لدعم الـ Dark Mode وتخفيف حدة المظهر داخل الجدول
  const getStatusStyles = (currentStatus: string) => {
    switch (currentStatus) {
        case 'pending': 
          return 'border-amber-400 focus:ring-amber-500 text-amber-700 bg-amber-50/60 dark:bg-amber-950/30 dark:text-amber-400';
        case 'processing': 
          return 'border-blue-400 focus:ring-blue-500 text-blue-700 bg-blue-50/60 dark:bg-blue-950/30 dark:text-blue-400';
        case 'shipped': 
          return 'border-indigo-400 focus:ring-indigo-500 text-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/30 dark:text-indigo-400';
        
        case 'completed':
          return 'border-green-400 focus:ring-green-500 text-green-700 bg-green-50/60 dark:bg-green-950/30 dark:text-green-400';
        case 'cancelled': 
          return 'border-red-400 focus:ring-red-500 text-red-700 bg-red-50/60 dark:bg-red-950/30 dark:text-red-400';
        case 'returned':
          return 'border-pink-400 focus:ring-pink-500 text-pink-700 bg-pink-50/60 dark:bg-pink-950/30 dark:text-pink-400';
        
        default: 
          return 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';
    }
  };


  return (

    <div className="inline-flex items-center gap-1.5">
        <select 
          value={status} 
          disabled={loading}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`border rounded-xl p-1 text-xs font-semibold focus:ring-1 disabled:opacity-50 transition-all duration-200 cursor-pointer outline-none ${getStatusStyles(status)}`}
        >
          <option value="pending" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">🟡 قيد الانتظار</option>
          <option value="processing" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">🔵 جاري التجهيز</option>
          <option value="shipped" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">🚚 تم الشحن</option>
          <option value="completed" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">🟢 مكتمل</option> {/* تم التعديل */}
          <option value="cancelled" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">🔴 ملغي</option>
          <option value="returned" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">🟠 مسترجع</option> {/* تم الإضافة */}
        </select>
        
        {loading && (
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 animate-pulse">
              ...
          </span>
        )}
    </div>
  );
};