import { Product } from '../../types';
import { motion } from 'motion/react';
import { Plus, Star } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  key?: string | number;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-[0px_20px_40px_rgba(49,72,101,0.08)] transition-all duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.limitedEdition && (
          <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm shadow-xl">
            Limited Edition
          </span>
        )}
        {product.newArrival && !product.limitedEdition && (
          <span className="absolute top-4 left-4 bg-[#f15549] text-white text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm shadow-xl">
            New Arrival
          </span>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-primary mb-2 tracking-tight group-hover:text-[#f15549] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <span className="text-lg font-black text-primary leading-none">${product.salePrice}</span>
                <span className="text-xs text-slate-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-lg font-black text-primary">${product.price}</span>
            )}
          </div>
          
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-10 h-10 p-0"
            onClick={() => onAddToCart(product)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
