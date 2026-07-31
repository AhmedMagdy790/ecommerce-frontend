import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Wallet, Truck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useCart } from '@/shared/hooks/useCart';
import { cn } from '@/shared/utils/cn';
import { Container } from '@/shared/components/Container';
import orderService from '../orders/services/orderService';

export const CheckoutFeature = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const tax = subtotal * 0.1;
  const shippingCharge = subtotal > 500 ? 0 : 25;
  const total = subtotal + tax + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsLoading(true);
    try {
      await orderService.createOrder({
        items: cart,
        total,
        subtotal,
        tax,
        shipping: formData,
        paymentMethod
      });
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error("Order failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface min-h-[80vh] flex items-center">
        <Container className="text-center flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-[#f15549] text-white rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-[#f15549]/40"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary mb-6 leading-tight">
            THANK YOU FOR <br /> YOUR ORDER!
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mb-12 font-medium">
            Your curation is being prepared. We've sent a confirmation email to your registered address.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Continue Discovering
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-16">
      <Container>
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">CHECKOUT PROCESS</p>
          <h1 className="text-5xl font-black tracking-tighter text-primary">FINALIZE ORDER</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Section 1: Shipping Information */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">01</span>
                <h2 className="text-xl font-black tracking-tight text-primary uppercase">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                  <input 
                    required 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-[#f15549]/20 transition-all shadow-sm" 
                    placeholder="e.g. Jonathan Sterling" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</label>
                  <input 
                    required 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-[#f15549]/20 transition-all shadow-sm" 
                    placeholder="+1 XXX XXX XXXX" 
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Address</label>
                  <input 
                    required 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-[#f15549]/20 transition-all shadow-sm" 
                    placeholder="Street, Building, Apartment No." 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">City / Region</label>
                  <input 
                    required 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-[#f15549]/20 transition-all shadow-sm" 
                    placeholder="City" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Postal Code</label>
                  <input 
                    required 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-[#f15549]/20 transition-all shadow-sm" 
                    placeholder="Zip Code" 
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Payment Methods */}
            <section className="space-y-8 pt-12 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">02</span>
                <h2 className="text-xl font-black tracking-tight text-primary uppercase">Payment Methods</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    "cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-start gap-4 shadow-sm",
                    paymentMethod === 'cod' ? "border-[#f15549] bg-[#f15549]/5" : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <div className="bg-slate-100 p-2 rounded-lg text-primary"><Truck className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="font-black text-primary text-sm uppercase tracking-widest">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Pay when you receive your order at your doorstep.</p>
                  </div>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('online')}
                  className={cn(
                    "cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-start gap-4 shadow-sm",
                    paymentMethod === 'online' ? "border-[#f15549] bg-[#f15549]/5" : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <div className="bg-slate-100 p-2 rounded-lg text-primary"><CreditCard className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="font-black text-primary text-sm uppercase tracking-widest">Online Payment</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Pay securely with Visa, Mastercard or Wallets.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Review */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white rounded-2xl p-10 shadow-[0px_20px_40px_rgba(49,72,101,0.06)]">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10">ORDER REVIEW</h2>
              
              <div className="space-y-6 mb-10">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-black text-primary tracking-tight truncate leading-none">{item.name}</h4>
                        <span className="text-sm font-black text-primary shrink-0">${item.salePrice || item.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.category}</p>
                      <p className="text-xs font-medium text-slate-500 mt-2">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-slate-50 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Shipping Fee</span>
                  <span className="font-black text-primary">${shippingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-slate-50">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-black tracking-tighter text-primary leading-none">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit"
                variant="coral" 
                size="lg" 
                className="w-full py-6 text-sm flex items-center justify-center gap-3"
                isLoading={isLoading}
              >
                Confirm Order <ArrowRight className="w-5 h-5" />
              </Button>

              <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Curated Check</span>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-100/50 rounded-xl flex items-center gap-4 text-slate-500">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Authenticity Guaranteed & 30-Day returns within the digital archive.
              </p>
            </div>
          </aside>
        </form>
      </Container>
    </div>
  );
};
