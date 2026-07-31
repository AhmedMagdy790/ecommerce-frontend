import { Link } from 'react-router-dom';
import {  Mail, MapPin, Phone } from 'lucide-react';


const PublicFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* القسم الأول: عن المتجر */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">متجري الإلكتروني</h3>
            <p className="text-sm leading-relaxed">
              نحن نوفر لك أفضل المنتجات بأعلى جودة وأفضل الأسعار. نسعى دائماً لتقديم تجربة تسوق استثنائية لعملائنا في كل مكان.
            </p>
          </div>

          {/* القسم الثاني: روابط سريعة */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-white transition">المنتجات</Link></li>
              <li><Link to="/about" className="hover:text-white transition">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">اتصل بنا</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">سلة التسوق</Link></li>
            </ul>
          </div>

          {/* القسم الثالث: معلومات التواصل */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm"><MapPin size={18} /> القاهرة، مصر</li>
              <li className="flex items-center gap-2 text-sm"><Phone size={18} /> +20 123 456 7890</li>
              <li className="flex items-center gap-2 text-sm"><Mail size={18} /> info@mystore.com</li>
            </ul>
            
            {/* أيقونات التواصل الاجتماعي */}
            <div className="flex gap-4 mt-6">
              {/* <a href="#" className="hover:text-indigo-400 transition"><Faceboo size={20} /></a>
              <a href="#" className="hover:text-indigo-400 transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-indigo-400 transition"><Twitter size={20} /></a> */}
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لـ متجري الإلكتروني.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;