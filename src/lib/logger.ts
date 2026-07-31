const isDev = import.meta.env.DEV;


export const logger = {

  info: (...args: unknown[]) => {
    if (isDev) {
      console.info("ℹ️ [INFO]:", ...args);
    }
  },


  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn("⚠️ [WARN]:", ...args);
    }
  },


  error: (...args: unknown[]) => {
    if (isDev) {
      console.error("❌ [ERROR]:", ...args);
    } else {
      // في وضع الإنتاج (Production)، يمكنك إرسال الخطأ إلى سرفرات المراقبة مثل Sentry
      // Sentry.captureException(args);
    }
  },


  debug: (...args: unknown[]) => {
    if (isDev && import.meta.env.VITE_ENABLE_DEBUG === "true") {
      console.debug("🐛 [DEBUG]:", ...args);
    }
  },
};

if (import.meta.env.DEV) {
  (window as any).logger = logger;
}