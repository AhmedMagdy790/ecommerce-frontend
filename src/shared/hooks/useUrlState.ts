// src/shared/hooks/useUrlState.ts
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useUrlState<T extends Record<string, unknown>>(defaultValues: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. قراءة القيم الحالية من الـ URL
  const state = Object.keys(defaultValues).reduce((acc, key) => {
    const val = searchParams.get(key);
    if (val !== null && val !== '') {
      acc[key as keyof T] = (typeof defaultValues[key] === 'number' ? Number(val) : val) as T[keyof T];
    } else {
      acc[key as keyof T] = defaultValues[key] as T[keyof T];
    }
    return acc;
  }, {} as T);

  // 2. دالة تحديث معزولة وتدعم الاستبدال التلقائي (Replace)
  const updateState = useCallback(
    (newPartialState: Partial<T>, options: { resetPage?: boolean } = { resetPage: true }) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);

          Object.entries(newPartialState).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.set(key, String(value));
            } else {
              params.delete(key);
            }
          });

          if (options.resetPage && params.has('page') && !('page' in newPartialState)) {
            params.set('page', '1');
          }

          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [state, updateState] as const;
}