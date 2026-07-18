// components/ui/PageError.tsx
import { useTranslation } from "react-i18next";

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
  isSectional?: boolean; // Changes layout if error is just one section
}

export default function PageError({ 
  message, 
  onRetry, 
  isSectional = false 
}: PageErrorProps) {
  const { t } = useTranslation('common');

  return (
    <div className={`flex flex-col items-center justify-center p-spacing-8 text-center ${isSectional ? 'h-64' : 'h-screen'}`}>
      <div className="mb-spacing-6">
        <span className="text-6xl">⚠️</span>
      </div>
      
      <h2 className="text-xl font-bold text-text-primary mb-spacing-2">
        {t('errors.title', 'Something went wrong')}
      </h2>
      
      <p className="text-text-secondary mb-spacing-6 max-w-sm">
        {message || t('errors.default_message', 'We are having trouble loading this content.')}
      </p>

      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-spacing-6 py-spacing-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
        >
          {t('errors.retry', 'Try again')}
        </button>
      )}
    </div>
  );
}