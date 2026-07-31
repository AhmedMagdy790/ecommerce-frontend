// src/features/search/hooks/useSearchEngine.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import searchService from './service/searchService';


export const useSearchEngine = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300); // Wait 300ms after typing

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchService.search(debouncedQuery),
    enabled: debouncedQuery.length > 2, // Only search if > 2 characters
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  return {
    query,
    setQuery,
    results: data?.items || [],
    isLoading,
    isOpen: debouncedQuery.length > 2
  };
};