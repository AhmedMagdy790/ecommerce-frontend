import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ChevronLeft } from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams(); // لاستخدام الـ slug في جلب بيانات المنتج لاحقاً
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* زر العودة */}
      <button className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition">
        <ChevronLeft size={20} /> العودة للمتجر
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* قسم الصور */}
        <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center text-gray-400">
          صورة المنتج الأساسية (معرض الصور)
        </div>

        {/* قسم التفاصيل */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">اسم المنتج {slug}</h1>
          <div className="flex items-center gap-2 mb-4 text-yellow-500">
            <Star size={20} fill="currentColor" />
            <span className="text-gray-600 font-medium">4.8 (120 تقييم)</span>
          </div>
          
          <p className="text-3xl font-bold text-indigo-600 mb-6">250 ر.س</p>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            وصف تفصيلي للمنتج يوضح الميزات والفوائد. هذا النص هو مكان مخصص لشرح القيمة المضافة التي سيحصل عليها العميل عند شراء هذا المنتج الرائع.
          </p>

          {/* التحكم في الكمية والإضافة للسلة */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button className="px-4 py-2 hover:bg-gray-100" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="px-4 font-bold">{quantity}</span>
              <button className="px-4 py-2 hover:bg-gray-100" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <button className="flex-grow bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              <ShoppingCart size={20} /> أضف إلى السلة
            </button>
            
            <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
              <Heart size={24} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;