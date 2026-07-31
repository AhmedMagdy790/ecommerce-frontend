# معمارية النظام (System Architecture)

## 1. فلسفة التصميم (Core Principle)
نحن نتبع مبدأ **Clean Architecture** و **Modular Design**. الهدف هو أن يكون كل موديول (Feature) مستقلاً تماماً، بحيث يمكن استبدال أي جزء (مثل تبديل مكتبة الـ UI أو قاعدة البيانات) دون التأثير على جوهر النظام.

## 2. هيكلية المجلدات (Modular Structure)
تم تقسيم النظام إلى ميزات (Features) داخل مجلد `src/features/`:

- **`features/[feature_name]/`**: يحتوي على كل ما يخص الميزة:
  - `api/`: استدعاءات الـ API.
  - `components/`: المكونات البصرية الخاصة بهذه الميزة.
  - `pages/`: الصفحات.
  - `routes.tsx`: مسارات الميزة.
  - `services/`: منطق العمل (Business Logic).

- **`shared/`**: يحتوي على الأجزاء المشتركة بين كل الموديلات:
  - `layouts/`: تخطيطات الصفحات (مثل `WebsiteLayout`).
  - `components/`: أزرار، مدخلات، نماذج عامة.
  - `hooks/`: دوال React مشتركة.
  - `lib/`: إعدادات الـ Axios و الـ API Client.

## 3. طبقات النظام (Layers - Dependency Rule)
تتبع التبعيات اتجاهاً واحداً من الخارج إلى الداخل:



1. **Presentation Layer (UI):** الواجهات (React Components).
2. **Application Layer (Use Cases):** منطق العمل (Services).
3. **Infrastructure Layer:** الاتصال بالـ API الخارجي (Axios/API Client).
4. **Domain Layer:** الكيانات الأساسية (Types/Interfaces).

## 4. تدفق البيانات (Data Flow)
1. **User Action:** المستخدم يضغط على زر في صفحة (Page).
2. **Service Call:** الصفحة تستدعي `Service` (من داخل الموديول).
3. **Infrastructure:** الـ `Service` يتواصل مع الـ API عبر الـ `API Client`.
4. **State Management:** البيانات المجلوبة يتم تحديثها في الـ `Store` (Zustand/Context).
5. **Render:** التحديث يظهر في واجهة المستخدم.

## 5. قواعد العمل (Conventions)
- **لا تستورد من موديول آخر مباشرة:** إذا احتاج موديول `Cart` بيانات من `Products`، يجب أن يتم ذلك عبر `shared/` أو واجهة مشتركة.
- **التنسيق:** التزم بملف الـ `eslint` و `prettier` المرفق لضمان نظافة الكود.