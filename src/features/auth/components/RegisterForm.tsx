import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, LockKeyhole, ArrowRight, LoaderCircle } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';

export const RegisterForm = () => {
  const { t } = useTranslation();
  const { methods, onSubmit, isLoading, submitError } = useRegisterForm();

  const {
    register,
    formState: { errors },
    watch,
  } = methods;

  const passwordValue = watch("password", "");

  const handleGoogleRegister = () => {
    console.log("Redirecting to Google Auth...");
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
          {t("auth.signUpLabel", "NEW ACCOUNT")}
        </span>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('auth.createAccount', 'Create an Account')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {t('auth.enterDetailsToGetStarted', 'Please enter your details to get started')}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-8 space-y-6">
        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-error/20 bg-error-bg p-3 text-sm text-error"
          >
            {submitError}
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-surface-hover hover:border-border-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* Google SVG Icon */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.15v3.14C3.15 21.32 7.23 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.15C.42 8.1 0 9.77 0 11.5s.42 3.4 1.15 4.88l4.12-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.15 6.62l4.12 3.14c.95-2.85 3.6-4.91 6.73-4.91z"
            />
          </svg>
          {t("auth.continueWithGoogle", "Continue with Google")}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-text-muted">
            {t("auth.orContinueWith", "Or continue with")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-medium">
              {t('auth.fullName', 'Full Name')}
            </label>
            <div className="relative">
              <User
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="register-name"
                type="text"
                placeholder="John Doe"
                disabled={isLoading}
                className="w-full rounded-xl border border-input-border bg-input py-3.5 pe-4 ps-11 text-sm outline-none transition placeholder:text-text-muted focus:border-input-focus focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium">
              {t('auth.emailAddress', 'Email Address')}
            </label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="register-email"
                type="email"
                placeholder="name@example.com"
                disabled={isLoading}
                className="w-full rounded-xl border border-input-border bg-input py-3.5 pe-4 ps-11 text-sm outline-none transition placeholder:text-text-muted focus:border-input-focus focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="register-phone" className="mb-2 block text-sm font-medium">
              {t('auth.phone', 'Phone Number')}
            </label>
            <div className="relative">
              <Phone
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="register-phone"
                type="tel"
                placeholder="01234567890"
                disabled={isLoading}
                className="w-full rounded-xl border border-input-border bg-input py-3.5 pe-4 ps-11 text-sm outline-none transition placeholder:text-text-muted focus:border-input-focus focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-xs text-error">{errors.phone.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium">
              {t('auth.password', 'Password')}
            </label>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="register-password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full rounded-xl border border-input-border bg-input py-3.5 pe-4 ps-11 text-sm outline-none transition placeholder:text-text-muted focus:border-input-focus focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                {...register("password")}
              />
            </div>

            {/* Password Strength Indicator */}
            {passwordValue && (
              <div className="flex gap-1 pt-2">
                <div className={`h-1 flex-1 rounded-full transition-all ${passwordValue.length > 5 ? 'bg-[var(--color-warning)]' : 'bg-border'}`} />
                <div className={`h-1 flex-1 rounded-full transition-all ${passwordValue.length > 8 ? 'bg-[var(--color-success)]' : 'bg-border'}`} />
                <div className={`h-1 flex-1 rounded-full transition-all ${/[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue) ? 'bg-[var(--color-success)]' : 'bg-border'}`} />
              </div>
            )}

            {errors.password && (
              <p className="mt-2 text-xs text-error">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="register-confirm" className="mb-2 block text-sm font-medium">
              {t('auth.confirmPassword', 'Confirm Password')}
            </label>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="register-confirm"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full rounded-xl border border-input-border bg-input py-3.5 pe-4 ps-11 text-sm outline-none transition placeholder:text-text-muted focus:border-input-focus focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                {...register("password_confirmed")}
              />
            </div>
            {errors.password_confirmed && (
              <p className="mt-2 text-xs text-error">{errors.password_confirmed.message}</p>
            )}
          </div>

          {/* Terms Notice */}
          <p className="text-xs text-text-secondary text-center">
            {t('auth.termsNotice', 'By signing up, you agree to our')}{' '}
            <Link to="/terms" className="text-primary hover:underline font-semibold">
              {t('auth.termsOfService', 'Terms of Service')}
            </Link>
          </p>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-button-bg px-4 py-3.5 text-sm font-semibold text-button-text shadow-md transition hover:bg-button-bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                <span>{t('auth.creatingAccount', 'Creating account...')}</span>
              </>
            ) : (
              <>
                <span>{t('auth.signUp', 'Sign Up')}</span>
                <ArrowRight aria-hidden="true" size={18} className="rtl:rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login Link */}
        <p className="text-center text-sm text-text-secondary pt-2 border-t border-border">
          {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
          <Link 
            to="/auth/login"
            className="font-semibold text-primary hover:underline"
          >
            {t('auth.signIn', 'Sign In')}
          </Link>
        </p>
      </div>
    </div>
  );
};