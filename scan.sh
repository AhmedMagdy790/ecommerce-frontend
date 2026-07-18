#!/bin/bash

echo "# تقرير هيكلية المشروع" > architecture-report.md
echo "" >> architecture-report.md
echo "## شجرة المجلدات (src)" >> architecture-report.md
echo '```' >> architecture-report.md

# استخدام find لعرض الملفات مع تجاهل المجلدات غير المرغوبة
find src -maxdepth 3 -not -path '*/.*' | sort | sed 's/[^-][^\/]*\// |/g' >> architecture-report.md

echo '```' >> architecture-report.md
echo "✅ تم توليد architecture-report.md بنجاح."