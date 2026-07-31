
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useLang } from '@/shared/context/LanguageContext';
import heroContent from "@/data/heroContent.json"

interface HeroProps {
  onShopClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onShopClick, onExploreClick }: HeroProps) {

  const {lang} = useLang()
  const t = heroContent[lang];

  return (
    <section className="relative w-full h-[620px] md:h-[760px] flex items-center overflow-hidden bg-slate-950">
      
      {/* Background Image with Vignette & Gradients */}
      <img
        className="absolute inset-0 w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-10000 ease-out opacity-85 dark:opacity-75"
        alt="A cinematic, high-fashion editorial photograph of a model in sophisticated charcoal couture, walking through a minimalist architectural space."
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnjr8sIl-sbR3FJa1Jy9gtNPa481VAGvjbl5TDwTjigJQL9owRgAI-UtWbS3wDjYMzUgWCS_s-imn0Mn_-GvQpAluRx6MRzdWBvuZy5tzhTazLG0EDUBdNB7iMLyKbRL_WKUcaQTn6Ou3IbQe_I_DUTQkq3yfQTmo5Bch5FStBiNZr0Wv9M_WqqC7yWfqXsUl5anCw3oxfOq76QmZLMXK7IMyzc2uvlz7LwPzpGxlmr-2O6M4lAm55H7UdUIckj2Qt56Ae6Q418Olv"
        referrerPolicy="no-referrer"
      />
      
      {/* Editorial Shadow Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent"></div>
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/40 to-transparent"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          
          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2"
          >
            <span className="h-px w-6 bg-indigo-500"></span>
            <span className="text-xs uppercase tracking-[0.3em] font-black font-display text-indigo-400">
              {t.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-white tracking-tight leading-[1.05]"
          >
           {lang === 'ar' ? 'ارتقِ بأسلوبك ' : 'Elevate Your '} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-200">
              {lang === 'ar' ? 'الرقمي' : 'Digital Style'}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 font-sans leading-relaxed max-w-xl"
          >
            {t.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={onShopClick}
              className="group bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/30 font-display text-sm tracking-wide flex items-center gap-2 transform active:scale-95 transition-all"
              id="btn-hero-primary"
            >
              <ShoppingBag className="w-4 h-4 translate-y-[-0.5px]" />
              {t.shop}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            
            <button
              onClick={onExploreClick}
              className="bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-white border border-white/20 hover:border-white/30 font-bold px-8 py-4 rounded-xl font-display text-sm tracking-wide flex items-center gap-2 backdrop-blur-md active:scale-95 transition-all"
              id="btn-hero-secondary"
            >
              {t.explore}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Absolute Badging Design Details */}
      <div className="absolute right-8 bottom-8 z-10 hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/80">
          {t.footerBadge}
        </span>
      </div>
    </section>
  );
}
