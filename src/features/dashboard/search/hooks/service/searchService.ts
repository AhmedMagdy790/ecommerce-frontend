// src/services/searchService.js
import axiosInstance from "@/services/axios";

const searchService = {
  /**
   * Search for products with fuzzy matching and pagination
   * @param {string} query - The search term
   * @param {number} page - Current page
   */
  search: async (query, page = 1) => {
    if (!query) return { items: [], total: 0 };

    // The axiosInstance handles the base URL and auth headers
    const response = await axiosInstance.get('/search', {
      params: {
        q: query,
        page,
        limit: 10,
        in_stock: true 
      }
    });

    return {
      items: response.items,
      total: response.total_count,
    };
  },

  /**
   * Fetch trending searches for the initial dropdown state
   */
  getTrending: async () => {
    return await axiosInstance.get('/search/trending');
  }
};

export default searchService;