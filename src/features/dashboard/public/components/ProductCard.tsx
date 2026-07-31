import { type IProduct } from '@/features/dashboard/products/types/types';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: IProduct;
  onAddToCart: (p: IProduct) => void;
  onToggleWishlist: (p: IProduct) => void;
  isWishlisted: boolean;
  onQuickView: (p: IProduct) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView
}: ProductCardProps) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/45 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/40 hover:shadow-xl dark:hover:shadow-slate-950/20 hover:border-slate-200/50 dark:hover:border-slate-700/50 transition-all duration-300"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900/80 overflow-hidden cursor-pointer">
        <img
          src={product.image}
          alt={product.name}
          onClick={() => onQuickView(product)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Badges on top left */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestSeller && (
            <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase bg-indigo-600 rounded-full px-2.5 py-1 text-center shadow-md">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-950 uppercase bg-yellow-400 rounded-full px-2.5 py-1 text-center shadow-md">
              New Arrival
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] sm:text-xs font-bold text-white bg-rose-500 rounded-full px-2.5 py-1 text-center shadow-md">
              {product.discountBadge}
            </span>
          )}
        </div>

        {/* Wishlist Button on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border shadow-md active:scale-90 transition-all ${
            isWishlisted
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-950/70 border-slate-200/20 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-950'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          id={`btn-wishlist-${product.id}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Floating actions visible on hover */}
        <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="p-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 active:scale-95 flex items-center justify-center"
            title="Quick View"
            id={`btn-quickview-eye-${product.id}`}
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-950 dark:hover:bg-indigo-505 text-white rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75 active:scale-95 flex items-center justify-center"
            title="Add to Cart"
            id={`btn-addtocart-hover-${product.id}`}
          >
            <ShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white dark:bg-slate-800/20">
        
        <div className="space-y-1">
          {/* Category */}
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {product.category}
          </p>

          {/* Name */}
          <h4 
            onClick={() => onQuickView(product)}
            className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer text-sm sm:text-base selection:bg-indigo-100 transition-colors"
          >
            {product.name}
          </h4>

          {/* Fabric indicator or Specs preview */}
          {product.fabric && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              {product.fabric}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Price & Action button */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50 dark:border-slate-800/40">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through">
                EGP {product.oldPrice?.toLocaleString()}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              EGP {product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="text-xs bg-slate-900 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold py-2 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all"
            id={`btn-addtocart-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
