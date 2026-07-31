// src/features/navbar/hooks/useNavbarData.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCategories = async () => {
  // Replace with your API endpoint
  const { data } = await axios.get('/api/v1/categories');
  return data;
};

export const useNavbarData = () => {
  return useQuery({
    queryKey: ['navbarCategories'],
    queryFn: fetchCategories,
    // Navbar data changes rarely: cache it for 1 hour
    staleTime: 1000 * 60 * 60, 
    // Keep it in cache even if component unmounts
    gcTime: 1000 * 60 * 60, 
  });
};