import { useState } from 'react';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">إتمام عملية الشراء</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* قسم بيانات الشحن */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck className="text-indigo-600" /> عنوان الشحن
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="الاسم الأول" className="p-3 border rounded-lg w-full" />
              <input type="text" placeholder="اسم العائلة" className="p-3 border rounded-lg w-full" />
              <input type="text" placeholder="العنوان" className="col-span-2 p-3 border rounded-lg w-full" />
              <input type="text" placeholder="المدينة" className="p-3 border rounded-lg w-full" />
              <input type="text" placeholder="رقم الهاتف" className="p-3 border rounded-lg w-full" />
            </div>
          </section>

          {/* قسم الدفع */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-indigo-600" /> طريقة الدفع
            </h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                <input type="radio" name="payment" className="mr-3" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                بطاقة ائتمان
              </label>
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                <input type="radio" name="payment" className="mr-3" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                الدفع عند الاستلام
              </label>
            </div>
          </section>
        </div>

        {/* قسم الملخص النهائي */}
        <div className="bg-gray-50 p-8 rounded-3xl h-fit border border-gray-200">
          <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between"><span>المنتجات (2)</span> <span>450 ر.س</span></div>
            <div className="flex justify-between"><span>الشحن</span> <span>0 ر.س</span></div>
            <hr className="border-gray-300" />
            <div className="flex justify-between text-xl font-bold"><span>الإجمالي</span> <span className="text-indigo-600">450 ر.س</span></div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <ShieldCheck size={20} /> تأكيد الطلب
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">معاملاتك مشفرة وآمنة تماماً.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;