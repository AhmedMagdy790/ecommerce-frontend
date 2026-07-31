import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Container } from '../../shared/components/Container';
import { Button } from '../../shared/components/Button';
import { useCart } from '../../shared/hooks/useCart';
import { cn } from '../../shared/utils/cn';

export const CartFeature = () => {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="bg-surface min-h-screen py-24">
        <Container className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-8"
          >
            <ShoppingBag className="w-10 h-10 text-slate-300" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-primary mb-4">YOUR BAG IS EMPTY</h1>
          <p className="text-slate-500 max-w-sm mb-10 font-medium">
            Looks like you haven't added any intentional artifacts to your collection yet.
          </p>
          <Button variant="primary" asChild>
            <Link to="/products">Start Discovering</Link>
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-16">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary mb-2">YOUR BAG</h1>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f15549]">{cart.length} items currently selected</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl shadow-[0px_20px_40px_rgba(49,72,101,0.04)] transition-all hover:scale-[1.01]"
                >
                  <div className="relative w-full md:w-32 h-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-primary tracking-tight leading-none mb-2">{item.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.category}</p>
                      </div>
                      <p className="text-lg font-black text-primary">${item.salePrice || item.price}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-500"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-6 text-sm font-black text-primary">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-500"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-[#f15549] transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black text-[#f15549] uppercase tracking-widest hover:gap-4 transition-all mt-8">
              <ArrowLeft className="w-4 h-4" /> Continue Discovering
            </Link>
          </div>

          {/* Table Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="bg-white rounded-2xl p-10 shadow-[0px_20px_40px_rgba(49,72,101,0.04)]">
              <h2 className="text-xl font-black text-primary tracking-tight mb-8">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm py-2">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Estimated Tax (10%)</span>
                  <span className="font-black text-primary">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-slate-100 pb-6">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                  <span className={cn("font-black", shipping === 0 ? "text-[#f15549]" : "text-primary")}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Grand Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary leading-none">${total.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Includes all taxes</p>
                  </div>
                </div>
              </div>

              <form className="mb-10">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    className="flex-1 bg-slate-50 border-none rounded-lg px-4 py-3 text-xs font-bold focus:ring-1 focus:ring-[#f15549]/20"
                  />
                  <Button variant="secondary" size="sm" className="px-6">Apply</Button>
                </div>
              </form>

              <Button variant="coral" size="lg" className="w-full py-5 text-sm" asChild>
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#f15549]" /> Secure SSL Checkout
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100/50 p-6 rounded-xl flex flex-col items-center text-center">
                <Truck className="w-5 h-5 text-primary mb-3" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Expedited Shipping Available</span>
              </div>
              <div className="bg-slate-100/50 p-6 rounded-xl flex flex-col items-center text-center">
                <RefreshCw className="w-5 h-5 text-primary mb-3" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
};
