import { useCategoryStore } from '@/features/dashboard/category/store/useCategoryStore';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';

interface CategoriesProps {
  onSelectCategory: (name: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {

    const {categories, fetchPublicCategories} = useCategoryStore();

    useEffect(() => {
        fetchPublicCategories();
    }, [])

    return (
        <section id="categories-section" className="py-16 md:py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] font-display">
                Curated Masterpieces
                </span>
                <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                Shop by Category
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-sans max-w-lg">
                Explore meticulously organized catalog spaces designed for high lifestyle integration.
                </p>
            </div>
            
            <button
                onClick={() => onSelectCategory('all')}
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors self-start md:self-auto"
                id="btn-view-all-categories"
            >
                Explore All Collections
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
                <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => onSelectCategory(cat.name)}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-900 shadow-lg cursor-pointer transform active:scale-98 transition-all"
                >
                {/* Category Image */}
                <img
                    src={cat.image}
                    alt={`${cat.name} Category`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-107 transition-transform duration-700 ease-out brightness-[0.85] dark:brightness-[0.75] group-hover:brightness-90"
                    referrerPolicy="no-referrer"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                {/* Card Label Header */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-200/90 uppercase border border-slate-200/20 rounded-full px-3 py-1 bg-slate-950/20 backdrop-blur-xs">
                    Collection {idx}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-115 transition-all text-white">
                    <ArrowUpRight className="w-4 h-4" />
                    </span>
                </div>

                {/* Card Body */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
                    {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium opacity-85 mt-1 group-hover:text-white transition-colors">
                    {/* {cat.count} */}
                    </p>
                </div>
                </motion.div>
            ))}
            </div>

        </div>
        </section>
    );
}
