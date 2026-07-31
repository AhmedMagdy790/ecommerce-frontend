import { useState } from 'react';
// سنقوم باستيراد المكون لاحقاً
// import ProductCard from '../components/ProductCard';

const ProductList = () => {
  // بيانات تجريبية (سيتم استبدالها لاحقاً بـ API)
  const products = [1, 2, 3, 4, 5, 6, 7, 8]; 

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* عنوان الصفحة وفلتر بسيط */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">جميع المنتجات</h1>
          <p className="text-gray-500">استكشف تشكيلتنا المميزة من المنتجات</p>
        </div>
        
        <select className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none">
          <option>الأحدث</option>
          <option>السعر من الأقل للأعلى</option>
          <option>السعر من الأعلى للأقل</option>
        </select>
      </div>

      {/* شبكة عرض المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((id) => (
          <div key={id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
             {/* هنا سيتم عرض مكون ProductCard لاحقاً */}
             <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">
               صورة المنتج {id}
             </div>
             <h3 className="font-bold text-lg">اسم المنتج المميز {id}</h3>
             <p className="text-indigo-600 font-bold mt-2">150 ر.س</p>
             <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">
               أضف للسلة
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;