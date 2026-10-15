import React from 'react';

interface SpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ fullScreen = false, message = "جاري التحميل..." }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm" 
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      {/* شكل الـ Spinner الخارجي */}
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    
        <div className="absolute w-2 h-2 bg-blue-600 rounded-full"></div>
      </div>

      {/* <CardSkeleton /> */}
      
      {/* نص الرسالة */}
      {message && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="border border-gray-200 p-4 rounded-lg w-full animate-pulse">
    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default Spinner;