// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 دقائق
            gcTime: 10 * 60 * 1000,   // 10 دقائق (الاحتفاظ بالبيانات في الكاش)
            retry: 1,                 // محاولة واحدة عند الفشل
            refetchOnWindowFocus: false, // عدم إعادة الجلب لمجرد التركيز على النافذة
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

    </QueryClientProvider>
  );
}