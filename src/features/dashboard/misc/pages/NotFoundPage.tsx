import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuthStore();

  const destination = isAuthenticated ? '/dashboard' : '/';
  const linkText = isAuthenticated ? 'العودة لوحة التحكم' : 'العودة للرئيسية';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-5 text-center dark:bg-gray-900">
      <div className="max-w-md">
        {/* يمكنك إضافة أيقونة أو صورة 404 هنا */}
        <h1 className="mb-4 text-9xl font-extrabold text-primary opacity-20">404</h1>
        
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          عذراً، هذه الصفحة غير موجودة!
        </h2>
        
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          يبدو أنك سلكت طريقاً خاطئاً. الرابط الذي تحاول الوصول إليه قد تم نقله أو حذفه.
        </p>

        <Link
          to={destination}
          replace
          className="btn-primary"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;