import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  // بيانات تجريبية (يتم استبدالها بـ Context API لاحقاً)
  const cartItems = [
    { id: 1, name: 'سماعات بلوتوث', price: 150, quantity: 1 },
    { id: 2, name: 'ساعة ذكية', price: 300, quantity: 1 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-12">
          {/* قائمة المنتجات */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                <div className="flex-grow">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-indigo-600 font-bold">{item.price} ر.س</p>
                </div>
                <div className="text-sm">الكمية: {item.quantity}</div>
                <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* ملخص الطلب */}
          <div className="bg-gray-50 p-6 rounded-3xl h-fit border border-gray-200">
            <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="font-bold">450 ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span className="text-green-600 font-bold">مجاني</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-indigo-600">450 ر.س</span>
              </div>
            </div>
            <Link 
              to="/checkout" 
              className="block w-full bg-indigo-600 text-white text-center py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              إتمام عملية الشراء
            </Link>
          </div>
        </div>
      ) : (
        // حالة السلة الفارغة
        <div className="text-center py-20">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-500">سلتك فارغة حالياً</h2>
          <Link to="/products" className="text-indigo-600 mt-4 block underline">ابدأ التسوق الآن</Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;