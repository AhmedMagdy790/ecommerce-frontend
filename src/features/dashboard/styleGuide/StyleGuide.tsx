import { ThemeToggleButton } from '@/shared/components/dashboard/common/ThemeToggleButton';
import React from 'react';

const StyleGuide = () => {
  return (
    <div className="min-h-screen bg-main-bg text-main-text p-10 font-outfit transition-colors duration-300">
      <header className="mb-16 border-b border-main-border pb-6">
        <h1 className="text-title-xl font-bold">Project Style Guide</h1>
          <ThemeToggleButton />
        <p className="text-theme-xl opacity-60">نظام التصميم المعتمد بناءً على متغيرات Tailwind v4</p>
      </header>

      {/* 1. Typography Section */}
      <section className="mb-16">
        <h2 className="text-title-sm mb-8 text-brand-500 underline">01. Typography (الخطوط)</h2>
        <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-main-border">
          <div>
            <span className="text-theme-xs text-gray-400">text-title-2xl (72px)</span>
            <h1 className="text-title-2xl font-black italic">Title Extra Large</h1>
          </div>
          <div>
            <span className="text-theme-xs text-gray-400">text-title-md (36px)</span>
            <h2 className="text-title-md font-bold">Medium Heading Section</h2>
          </div>
          <div>
            <span className="text-theme-xs text-gray-400">text-theme-sm (14px)</span>
            <p className="text-theme-sm">هذا نص عادي يستخدم في الفقرات، يدعم اللغة العربية والانجليزية بخط Outfit.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="p-8 bg-main-bg min-h-screen font-outfit">
          <div className="mb-6">
            <h2 className="text-title-sm font-bold text-main-text">الجلسات النشطة</h2>
            <p className="text-theme-sm text-gray-500">إدارة جلسات تسجيل الدخول والأجهزة المتصلة.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-main-border bg-main-bg shadow-theme-sm">
            <table className="w-full text-left border-collapse">
              {/* Table Header */}
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-main-border">
                <tr>
                  <th className="px-6 py-4 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">الجهاز / المتصفح</th>
                  <th className="px-6 py-4 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">العنوان (IP)</th>
                  <th className="px-6 py-4 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">التاريخ</th>
                  <th className="px-6 py-4 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">الحالة</th>
                  <th className="px-6 py-4 text-theme-xs font-semibold uppercase tracking-wider text-gray-500 text-right">الإجراء</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-main-border">
                {/* Row 1 */}
                <tr className="hover:bg-gray-25 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-50 text-brand-600 flex items-center justify-center font-bold">M</div>
                      <div>
                        <div className="text-theme-sm font-medium text-main-text">MacBook Pro</div>
                        <div className="text-theme-xs text-gray-500">Chrome • macOS</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-theme-sm text-gray-600 dark:text-gray-400 font-mono">192.168.1.1</td>
                  <td className="px-6 py-4 text-theme-sm text-gray-600 dark:text-gray-400">منذ ساعتين</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-theme-xs font-medium bg-success-50 text-success-700 border border-success-200">
                      نشط الآن
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-theme-sm font-semibold text-error-600 hover:text-error-700 transition-colors">
                      إنهاء الجلسة
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-gray-25 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center font-bold">I</div>
                      <div>
                        <div className="text-theme-sm font-medium text-main-text">iPhone 15 Pro</div>
                        <div className="text-theme-xs text-gray-500">Safari • iOS</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-theme-sm text-gray-600 dark:text-gray-400 font-mono">102.14.55.2</td>
                  <td className="px-6 py-4 text-theme-sm text-gray-600 dark:text-gray-400">15 أكتوبر 2023</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-theme-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      منتهي
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-theme-sm font-semibold text-gray-400 cursor-not-allowed">
                      مؤرشف
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Colors Palette */}
      <section className="mb-16">
        <h2 className="text-title-sm mb-8 text-brand-500 underline">02. Brand Colors (الألوان)</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {['50', '100', '300', '500', '700', '900'].map((shade) => (
            <div key={shade} className="text-center">
              <div 
                className={`h-20 w-full rounded-lg shadow-theme-sm mb-2 bg-brand-${shade}`}
              ></div>
              <span className="text-theme-xs font-mono">brand-{shade}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Components */}
      <section className="mb-16">
        <h2 className="text-title-sm mb-8 text-brand-500 underline">03. Components (العناصر)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card Example */}
          <div className="p-6 rounded-2xl bg-main-bg border border-main-border shadow-theme-lg">
            <div className="w-12 h-12 bg-success-100 text-success-600 rounded-full flex items-center justify-center mb-4">
              ✓
            </div>
            <h3 className="text-theme-xl font-bold mb-2">Success Card</h3>
            <p className="text-theme-sm opacity-70 mb-4">كارت تجريبي يستخدم الظلال (shadow-theme-lg) والمتغيرات الوظيفية.</p>
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-all shadow-focus-ring">
              Action Button
            </button>
          </div>

          {/* Form Example */}
          <div className="p-6 rounded-2xl bg-main-bg border border-main-border">
            <h3 className="text-theme-xl font-bold mb-4">Input Fields</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-theme-xs mb-1 font-medium">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@brand.com"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-error-500">
                <span className="text-theme-xs">⚠️ هذا الحقل مطلوب</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Shadows & Layers */}
      <section>
        <h2 className="text-title-sm mb-8 text-brand-500 underline">04. Elevation (الظلال)</h2>
        <div className="flex flex-wrap gap-8">
          <div className="p-10 bg-white dark:bg-gray-800 shadow-theme-xs rounded-lg">XS Shadow</div>
          <div className="p-10 bg-white dark:bg-gray-800 shadow-theme-md rounded-lg">MD Shadow</div>
          <div className="p-10 bg-white dark:bg-gray-800 shadow-theme-xl rounded-lg">XL Shadow</div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;