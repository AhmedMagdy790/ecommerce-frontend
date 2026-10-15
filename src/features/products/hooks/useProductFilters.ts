// hooks/useProductFilters.ts
import { useSearchParams } from 'react-router-dom';

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category_id: searchParams.get('category_id') || undefined,
    search: searchParams.get('search') || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined,
    page: Number(searchParams.get('page')) || 1,
    per_page: Number(searchParams.get('per_page')) || 12,
  };

  const setFilter = (key: string, value: any) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  return { filters, setFilter };
};