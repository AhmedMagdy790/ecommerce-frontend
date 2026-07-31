const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* العنوان الرئيسي */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">قصتنا</h1>
        <p className="text-lg text-gray-600">
          نحن أكثر من مجرد متجر إلكتروني؛ نحن وجهتك الموثوقة لأفضل المنتجات.
        </p>
      </div>

      {/* قسم الرؤية والرسالة */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-indigo-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">رؤيتنا</h2>
          <p className="text-gray-700 leading-relaxed">
            أن نصبح المنصة الأولى التي يثق بها المتسوق العربي، من خلال تقديم 
            مزيج فريد من الجودة العالية والأسعار التنافسية.
          </p>
        </div>
        <div className="bg-indigo-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">رسالتنا</h2>
          <p className="text-gray-700 leading-relaxed">
            تسهيل تجربة التسوق الإلكتروني وتوفير منتجات مبتكرة تلبي احتياجات 
            عملائنا اليومية بكل سهولة وأمان.
          </p>
        </div>
      </div>

      {/* قسم لماذا نحن */}
      <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">لماذا يختارنا العملاء؟</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">✓</span>
            <span className="text-gray-700">توفير منتجات أصلية 100% مع ضمان الجودة.</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">✓</span>
            <span className="text-gray-700">خدمة عملاء متفانية تعمل على مدار الساعة لخدمتك.</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">✓</span>
            <span className="text-gray-700">توفير خيارات دفع متعددة تناسب الجميع.</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 font-bold mr-2">✓</span>
            <span className="text-gray-700">سياسة استرجاع مرنة وسهلة لضمان رضاك التام.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;