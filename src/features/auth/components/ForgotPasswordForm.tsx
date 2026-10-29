import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const { methods, onSubmit, isLoading, submitError, isSuccess } = useForgotPasswordForm();

  const {
    register,
    formState: { errors },
  } = methods;

  return (
    <div className="w-full">
      {/* 1. Header Section */}
      <div className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
          {t("auth.resetPasswordLabel", "PASSWORD RECOVERY")}
        </span>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('auth.resetPasswordTitle', 'Reset Password')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {t('auth.resetPasswordSubtitle', 'Enter your email address and we will send you instructions to reset your password')}
        </p>
      </div>

      {/* 2. Main Card Container */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-8 space-y-6">
        {/* Error Message Alert */}
        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-error/20 bg-error-bg p-3 text-sm text-error"
          >
            {submitError}
          </div>
        )}

        {/* Success Message Alert */}
        {isSuccess && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-success/20 bg-success-bg p-3 text-sm text-success"
          >
            <CheckCircle2 size={18} className="shrink-0 text-success" />
            <span>{t('auth.resetEmailSent', 'A password reset link has been sent to your email address.')}</span>
          </div>
        )}

        {/* 3. Form */}
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium">
              {t('auth.emailAddress', 'Email Address')}
            </label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "forgot-email-error" : undefined}
                disabled={isLoading || isSuccess}
                className="w-full rounded-xl border border-input-border bg-input py-3.5 pe-4 ps-11 text-sm outline-none transition placeholder:text-text-muted focus:border-input-focus focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p id="forgot-email-error" className="mt-2 text-xs text-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading || isSuccess}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-button-bg px-4 py-3.5 text-sm font-semibold text-button-text shadow-md transition hover:bg-button-bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                <span>{t('auth.sending', 'Sending...')}</span>
              </>
            ) : (
              <span>{t('auth.sendResetLink', 'Send Reset Link')}</span>
            )}
          </button>
        </form>

        {/* 4. Back to Login Link */}
        <div className="pt-2 border-t border-border text-center">
          <Link 
            to="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft aria-hidden="true" size={16} className="rtl:rotate-180" />
            <span>{t('auth.backToLogin', 'Back to Login')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};