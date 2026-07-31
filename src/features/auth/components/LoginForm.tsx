import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/hooks/useLanguage';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate('/admin'); 
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.message || 
        (isArabic ? 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً' : 'An unexpected error occurred, please try again later')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-[var(--spacing-8)] text-center lg:text-start">
        <h2 className="text-[var(--text-3xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
          {isArabic ? 'مرحباً بك مجدداً' : 'Welcome Back'}
        </h2>
        <p className="mt-[var(--spacing-2)] text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          {isArabic ? 'الرجاء إدخال بيانات حسابك لتسجيل الدخول' : 'Please enter your credentials to sign in'}
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="w-full bg-[var(--card-bg)] p-[var(--spacing-8)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] border border-[var(--card-border)] backdrop-blur-sm transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]"
      >
        {error && (
          <div className="mb-[var(--spacing-5)] p-[var(--spacing-4)] bg-[var(--color-error)]/10 text-[var(--color-error)] text-[var(--text-sm)] rounded-[var(--radius-md)] border border-[var(--color-error)]/20 text-center flex items-center justify-center gap-[var(--spacing-2)] animate-shake">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-[var(--spacing-5)]">
          {/* Email Field */}
          <div className="space-y-[var(--spacing-2)]">
            <label className="block text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-secondary)] uppercase tracking-wider">
              {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              placeholder={isArabic ? "name@example.com" : "name@example.com"}
              className="w-full p-[var(--spacing-3)] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-[var(--radius-md)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--input-focus)]/20 outline-none transition-all duration-[var(--duration-normal)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-[var(--text-sm)]"
              value={formData.email}
              onChange={(e) => {
                if (error) setError(null);
                setFormData(prev => ({ ...prev, email: e.target.value }));
              }}
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-[var(--spacing-2)]">
            <div className="flex items-center justify-between">
              <label className="block text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-secondary)] uppercase tracking-wider">
                {isArabic ? 'كلمة المرور' : 'Password'}
              </label>
              <Link 
                to="/forgot-password"
                className="text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-primary)] hover:underline"
              >
                {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-[var(--spacing-3)] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-[var(--radius-md)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--input-focus)]/20 outline-none transition-all duration-[var(--duration-normal)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-[var(--text-sm)]"
              value={formData.password}
              onChange={(e) => {
                if (error) setError(null);
                setFormData(prev => ({ ...prev, password: e.target.value }));
              }}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-[var(--spacing-6)] bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] py-[var(--spacing-3)] px-[var(--spacing-4)] rounded-[var(--radius-md)] font-[var(--font-medium)] text-[var(--text-sm)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-[var(--spacing-2)]">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              <span>{isArabic ? 'جاري الدخول...' : 'Signing in...'}</span>
            </span>
          ) : (
            isArabic ? 'تسجيل الدخول' : 'Sign In'
          )}
        </button>
      </form>
    </div>
  );
};