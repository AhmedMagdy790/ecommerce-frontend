/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sun, 
  Moon, 
  SlidersHorizontal,
  LogOut,
  Settings,
  Package,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCategoryStore } from '@/features/category/store/useCategoryStore';

type Theme = "light" | "dark";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  darkModeTheme: Theme | string;
  onToggleDarkMode: () => void;
  onOpenAssistant: () => void;
}

export default function PublicNavbar({
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  darkModeTheme,
  onToggleDarkMode,
  onOpenAssistant
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const {categories, fetchPublicCategories} = useCategoryStore();

  useEffect(() => {
    fetchPublicCategories();
  }, []);


  useEffect(() => {
    setDarkMode(darkModeTheme == 'dark')
  }, [darkModeTheme])

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          id="btn-mobile-menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-8">
          <a 
            href="#" 
            onClick={() => { onSelectCategory('all'); onSearchChange(''); }}
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-900 dark:text-white"
            id="logo"
          >
            LuxeStore
          </a>

          {/* Desktop Links with category dropdown */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => { onSelectCategory('all'); onSearchChange(''); }}
              className={`text-sm font-medium tracking-wide transition-colors ${
                selectedCategory === 'all' && !searchTerm
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Shop All
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                id="btn-category-dropdown"
              >
                Categories <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2.5 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700/50 py-2 z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => onSelectCategory('all')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                    >
                      All Collections
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.name)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedCategory === cat.name
                            ? 'bg-slate-50 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Assistant launch direct */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold py-1.5 px-3 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-all border border-indigo-100 dark:border-indigo-900/30"
              id="btn-nav-ai-stylist"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              AI Stylist
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm hidden sm:block relative">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search premium collections..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all outline-none"
              id="input-navbar-search"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                id="btn-clear-search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action icons & interactive profiles */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Dark Mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors relative group"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            id="btn-dark-mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors relative group"
            id="btn-nav-wishlist"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors relative group"
            id="btn-nav-cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
              id="btn-nav-user"
            >
              <User className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700/50 py-2.5 z-50 text-slate-700 dark:text-slate-200"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/50 mb-1.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">luxury.shopper@gmail.com</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-750 inline-flex items-center gap-2 transition-colors">
                    <Package className="w-4 h-4 text-slate-400" /> My Orders
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-750 inline-flex items-center gap-2 transition-colors">
                    <Settings className="w-4 h-4 text-slate-400" /> Account Settings
                  </button>
                  <div className="h-px bg-slate-100 dark:border-slate-700/50 my-1.5"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 inline-flex items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile search bar (only viewport-adaptive) */}
      <div className="px-4 pb-4 sm:hidden">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full pl-9 pr-8 py-2 text-sm text-slate-950 dark:text-white outline-none"
            id="input-mobile-search"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation drawer for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 z-50 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-55 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-black tracking-tight dark:text-white">LuxeStore</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => { onSelectCategory('all'); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-base font-semibold ${
                      selectedCategory === 'all' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    All Collections
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Categories</p>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { onSelectCategory(cat.name); setIsMobileMenuOpen(false); }}
                        className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                          selectedCategory === cat.name ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => { onOpenAssistant(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl py-3 px-4 text-sm font-bold shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Chat with AI Stylist
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Premium Guest</p>
                    <p className="text-xs text-slate-400">luxury.shopper@gmail.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
