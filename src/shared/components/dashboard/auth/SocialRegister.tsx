export default function SocialRegister() {
  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Register
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to Register!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
        <button type="button" className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
          {/* Google SVG */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18.7511 10.1944C18.7511 9.47495..." fill="#4285F4"/>
          </svg>
          Register with Google
        </button>
        <button type="button" className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
          {/* X SVG */}
          <svg width="21" className="fill-current" height="20" viewBox="0 0 21 20">
            <path d="M15.6705 1.875H18.4272..." />
          </svg>
          Register with X
        </button>
      </div>

      <div className="relative py-3 sm:py-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
            Or
          </span>
        </div>
      </div>
    </div>
  );
}