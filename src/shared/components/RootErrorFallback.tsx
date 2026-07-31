interface RootErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const RootErrorFallback = ({ error, resetErrorBoundary }: RootErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-red-500 mb-4">
          {/* أيقونة تحذير من Lucide */}
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">عذراً، حدث خطأ ما!</h2>
        <p className="text-gray-600 mb-6 font-mono text-sm bg-gray-100 p-3 rounded">
          {error.message}
        </p>
        
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          إعادة تحميل التطبيق
        </button>
      </div>
    </div>
  );
};

export default RootErrorFallback;