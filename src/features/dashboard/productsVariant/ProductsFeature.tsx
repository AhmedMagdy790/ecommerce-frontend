import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/shared/components/Container';
import { ProductCard } from '@/shared/components/ProductCard';
import { Button } from '@/shared/components/Button';
import { useCart } from '@/shared/hooks/useCart';
import { PRODUCTS, CATEGORIES } from '../../constants';
import { Product } from '../../types';
import { cn } from '@/shared/utils/cn';

export const ProductsFeature = () => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (sortOrder === 'Price: Low-High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'Price: High-Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'Newest') {
      result.sort((a, b) => (Number(b.id) - Number(a.id))); // Mock sorting
    }
    
    return result;
  }, [activeCategory, searchQuery, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortOrder]);

  return (
    <div className="bg-surface min-h-screen py-16">
      <Container>
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary leading-none mb-4">ARTIFACTS</h1>
            <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">
              Curate your experience. Currently showing {filteredProducts.length} artifacts.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative group">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg px-6 py-2.5 pr-12 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option>Newest</option>
                <option>Price: Low-High</option>
                <option>Price: High-Low</option>
                <option>Most Popular</option>
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Categories
              </h3>
              <div className="flex flex-col gap-3">
                {['All', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "text-sm font-bold text-left py-2 px-4 rounded-lg transition-all flex justify-between items-center",
                      activeCategory === cat 
                        ? "bg-primary text-white" 
                        : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {cat}
                    <span className="text-[10px] opacity-40">
                      {cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Search Archive</h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-12 py-3 text-sm focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="pt-10 border-t border-slate-200">
              <Button 
                variant="outline" 
                className="w-full text-[10px] tracking-[0.2em]"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setSortOrder('Newest');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9 flex flex-col items-center">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full mb-16">
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map(p => (
                      <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="flex items-center gap-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={cn(
                            "w-10 h-10 rounded-lg font-black text-xs tracking-widest transition-all",
                            currentPage === i + 1 
                              ? "bg-primary text-white scale-110 shadow-lg" 
                              : "bg-white text-slate-400 hover:bg-slate-50"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </nav>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 flex flex-col items-center text-center max-w-sm"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-8">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-primary mb-4">NO ARTIFACTS FOUND</h2>
                <p className="text-slate-500 mb-8">
                  We couldn't find any pieces matching your current curation. Try adjusting your filters.
                </p>
                <Button variant="primary" onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}>
                  View All Pieces
                </Button>
              </motion.div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
};
