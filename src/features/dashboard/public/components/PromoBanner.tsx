import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Tag, ShoppingBag } from 'lucide-react';

interface PromoBannerProps {
  onShopPromoClick?: () => void;
}

export default function PromoBanner({ onShopPromoClick }: PromoBannerProps) {
  // Live Countdown State: Let's initialize with 5 hours, 20 minutes, 15 seconds
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 20,
    seconds: 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
            } else {
              // Reset to 24 hours for promo fluidity when timing ends
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUnit = (unit: number) => {
    return unit < 10 ? `0${unit}` : `${unit}`;
  };

  return (
    <section className="py-12 bg-slate-100 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-red-650 to-indigo-800 dark:from-indigo-905 dark:to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 py-16">
          
          {/* Subtle elegant pattern details */}
          <div className="absolute inset-0 opacity-15 flex justify-center items-center pointer-events-none">
            <span className="text-[14vw] font-black italic select-none tracking-tighter text-white">
              LIMITED FLASH SALE LIMITED
            </span>
          </div>

          <div className="relative z-10 space-y-6 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-4 py-1.5 backdrop-blur-md">
              <Tag className="w-3.5 h-3.5 text-yellow-350" />
              <span className="text-xs font-bold tracking-widest font-mono uppercase">
                Seasonal Sale - Up to 50% Off 
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
              Don't Miss Out.<br />
              Mid-Year Vault Open.
            </h2>
            
            <p className="text-sm sm:text-base text-slate-200">
              Discounts are automatically triggered at checkout drawers. Valid across all luxury apparel, customized wearable electronics, and pristine home styling.
            </p>

            <button
              onClick={onShopPromoClick}
              className="bg-white hover:bg-slate-50 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg font-display text-sm flex items-center justify-center gap-2 mx-auto lg:mx-0 active:scale-95 transition-all"
              id="btn-promo-action"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              Shop the Sale
            </button>
          </div>

          {/* Countdown Clock Panel */}
          <div className="relative z-10 flex flex-col items-center gap-4 bg-slate-950/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md max-w-xs w-full">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold font-mono tracking-widest uppercase mb-1">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" /> Flash ends in
            </div>

            <div className="flex items-center justify-center gap-3 text-white">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight bg-slate-950/80 rounded-xl p-3 inline-block shadow-inner w-16 text-center">
                  {formatUnit(timeLeft.hours)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Hrs</span>
              </div>
              <span className="text-2xl font-black mb-6">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight bg-slate-950/80 rounded-xl p-3 inline-block shadow-inner w-16 text-center">
                  {formatUnit(timeLeft.minutes)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Mins</span>
              </div>
              <span className="text-2xl font-black mb-6">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight bg-slate-950/80 rounded-xl p-3 inline-block shadow-inner w-16 text-center text-rose-450">
                  {formatUnit(timeLeft.seconds)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Secs</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
