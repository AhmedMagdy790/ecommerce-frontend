المجلد الرئيسي,الوظيفة والمسؤولية
api/,"إعدادات الاتصال المركزية (Axios Instance, Interceptors, Endpoints, Error Handlers)."
components/,"المكونات العامة المشتركة وتصنيفات الشاشات (Admin, Auth, Cart, Checkout, Layout, Guard)."
config/,إعدادات ملفات التكوين العامة والثوابت الأساسية للتطبيق.
context/ & providers/,مزودات الحالة العامة (Context Providers) وتجميعها في AppProviders.tsx.
features/,"قلب التطبيق؛ تقسيم حسب الميزات (Auth, Cart, Product, Order, Dashboard, Notification) وكل ميزة تحوي (api, components, hooks, services, store, types)."
hooks/,الـ Custom Hooks العامة والمشتركة على مستوى التطبيق.
locales/ & i18n/,ملفات الترجمة واللغات (عربي/إنجليزي) وإعدادات مكتبة الترجمة.
pages/,صفحات التوجيه الرئيسية (Pages) مرتبطة بمسارات التطبيق.
routes/,"إعدادات وتصنيفات الـ Router وحمايات المسارات (Auth, Public, Admin)."
services/,الخدمات الخارجية وخدمات الدفع والشحن والموقع.
shared/,مكونات، أدوات (Utils)، أنواع (Types)، وخطافات مشتركة قابلة لإعادة الاستخدام في كل مكان.
store/,مخازن الحالة المركزية باستخدام Zustand (مثل authStore و useSettingsStore).
styles/,ملفات التنسيق العامة و CSS Reset وتصميم الثيمات.
