/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { type IProduct } from '@/features/dashboard/products/types/types';
import { useProductStore } from '@/features/dashboard/products/store/useProductStore';

interface BestSellersProps {
  onAddToCart: (p: IProduct) => void;
  onToggleWishlist: (p: IProduct) => void;
  wishlistIds: string[];
  onQuickView: (p: IProduct) => void;
}

export default function BestSellers({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView
}: BestSellersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

    const {products, fetchPublicProducts} = useProductStore();

    useEffect(() => {
        fetchPublicProducts()
    }, [])

  
  // Filter bestsellers
  const bestSellers = products.filter((p) => p.isBestSeller);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="bestsellers-section" className="py-16 md:py-24 bg-white dark:bg-slate-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <Award className="w-4 h-4" /> Top Audience Selections
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
              Best Sellers
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              The pieces everyone is talking about. Hand-picked on-demand global favourites.
            </p>
          </div>

          {/* Slider Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-white rounded-full transition-all active:scale-90"
              aria-label="Previous items"
              id="btn-bestsellers-prev"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-white rounded-full transition-all active:scale-90"
              aria-label="Next items"
              id="btn-bestsellers-next"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Area */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-6 px-1.5"
        >
          {bestSellers.map((prod) => (
            <div 
              key={prod.id} 
              className="min-w-[270px] sm:min-w-[320px] max-w-[320px] snap-start"
            >
              <ProductCard
                product={prod}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(prod.id)}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
