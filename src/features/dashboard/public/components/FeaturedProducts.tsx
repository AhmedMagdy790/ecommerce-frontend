/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { type IProduct } from '@/features/dashboard/products/types/types';
import { useProductStore } from '@/features/dashboard/products/store/useProductStore';
import ProductCard from './ProductCard';
import { type CartItem } from '@/features/dashboard/cart/types/cart';

interface FeaturedProductsProps {
  onAddToCart: (p: CartItem) => void;
  onToggleWishlist: (p: IProduct) => void;
  wishlistIds: string[];
  onQuickView: (p: IProduct) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
}

const CATS = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty'];

export default function FeaturedProducts({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  selectedCategory,
  onSelectCategory,
  searchTerm
}: FeaturedProductsProps) {
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');

  const {products, fetchPublicProducts} = useProductStore();

  useEffect(() => {
    fetchPublicProducts()
  }, [])

  // Filter products by selectedCategory tab, search query
  let filtered = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory.toLowerCase() === 'all' || prod.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm || 
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prod.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prod?.category?.toLowerCase()?.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort them
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="featured-products-section" className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.22em] font-display">
            Aesthetic Collection Catalogue
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-sans">
            Unveiled releases made from premium-sourced materials, backed by rigorous lifestyle engineering.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-10 border-b border-slate-100 dark:border-slate-800">
          
          {/* Categories Tab selector */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1.5 md:pb-0">
            {CATS.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat === 'All' ? 'all' : cat)}
                  className={`text-xs font-bold font-display tracking-widest uppercase py-2.5 px-5 rounded-full whitespace-nowrap active:scale-95 transition-all ${
                    active
                      ? 'bg-slate-905 dark:bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-805 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-800'
                  }`}
                  id={`btn-cat-tab-${cat}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sorter Dropdown */}
          <div className="flex items-center gap-3.5 self-end md:self-auto">
            <span className="text-xs text-slate-450 dark:text-slate-400 inline-flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-xs font-semibold text-slate-700 dark:text-slate-100 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              id="select-product-sorting"
            >
              <option value="relevance">Highly Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Dynamic Catalog Results Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(prod.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div id="no-results" className="text-center py-20 bg-white dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800/40">
            <p className="text-lg font-bold text-slate-800 dark:text-white">No products found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Try adjusting your search criteria or category filter.</p>
            <button
              onClick={() => { onSelectCategory('all'); }}
              className="mt-4 text-xs font-bold bg-slate-900 hover:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-505 text-white py-2.5 px-6 rounded-full transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
