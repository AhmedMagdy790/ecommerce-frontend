import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
        <p className="text-gray-600">نحن هنا للإجابة على استفساراتك، لا تتردد في مراسلتنا.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* قسم النموذج */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition" placeholder="أحمد محمد" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input type="email" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition" placeholder="example@mail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
              <textarea rows={4} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition" placeholder="كيف يمكننا مساعدتك؟"></textarea>
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              <Send size={18} /> إرسال الرسالة
            </button>
          </form>
        </div>

        {/* قسم معلومات الاتصال */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600"><MapPin size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">العنوان</h3>
              <p className="text-gray-600">القاهرة، مصر - المنطقة التجارية المركزية</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600"><Phone size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">اتصل بنا</h3>
              <p className="text-gray-600">+20 123 456 7890</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600"><Mail size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">البريد الإلكتروني</h3>
              <p className="text-gray-600">support@mystore.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;