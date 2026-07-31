/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

const MESSAGES = [
  'Free worldwide express shipping for orders above 2,500 EGP',
  'Today\'s deals: Up to 40% off on Autumn-Winter Collections',
  'Use code LUXE10 for an extra 10% off at checkout'
];

interface AnnouncementBarProps {
  onExplorePromo?: () => void;
}

export default function AnnouncementBar({ onExplorePromo }: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div id="announcement-bar" className="relative bg-slate-950 text-white py-2.5 px-4 overflow-hidden border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:block w-6 h-6"></div> {/* balance spacer */}
        
        <div className="flex-1 flex items-center justify-center gap-2 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="inline-flex items-center gap-1.5"
            >
              {MESSAGES[currentIndex]}
              <button 
                onClick={onExplorePromo}
                className="underline hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5 ml-1 transition-colors"
                id="btn-announcement-cta"
              >
                Details <ArrowRight className="w-3 h-3" />
              </button>
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          aria-label="Close announcement bar"
          id="btn-close-announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
