import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Container } from '@/shared/components/Container';
import { Button } from '@/shared/components/Button';
import { ProductCard } from '@/shared/components/ProductCard';
import { useCart } from '@/shared/hooks/useCart';
import { PRODUCTS, CATEGORIES } from '../../constants';

export const HomeFeature = () => {
  const { addToCart } = useCart();
  const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542491595-3015c1c8c304?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Watch Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <Container className="relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[#f15549] font-black tracking-[0.2em] text-xs uppercase mb-6 bg-[#f15549]/10 px-4 py-2 rounded-full">
              Limited Edition Release
            </span>
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              THE FUTURE OF <br />
              <span className="text-slate-400">TRADITION.</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
              Curating the world's most intentional artifacts. Every piece is a story of craftsmanship and timeless design.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="coral" size="lg" asChild>
                <Link to="/products" className="flex items-center gap-2">
                  Shop Collection <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                View Archive
              </Button>
            </div>
          </motion.div>
        </Container>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          <div className="w-12 h-1 bg-white rounded-full" />
          <div className="w-12 h-1 bg-white/30 rounded-full" />
          <div className="w-12 h-1 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-surface">
        <Container>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {CATEGORIES.map((cat, i) => (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 ring-2 ring-offset-4 ring-transparent group-hover:ring-[#f15549] transition-all duration-500">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=300`} 
                    alt={cat}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className="text-xs font-black tracking-widest uppercase text-slate-500 group-hover:text-primary transition-colors">
                  {cat}
                </span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-surface-container-low">
        <Container>
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-primary">BEST SELLERS</h2>
              <p className="text-slate-500 mt-2 font-medium">The pieces our community keeps returning to.</p>
            </div>
            <Link to="/products" className="text-xs font-black tracking-widest uppercase border-b border-primary pb-1 hover:text-[#f15549] hover:border-[#f15549] transition-colors flex items-center gap-1">
              View Collection <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </Container>
      </section>

      {/* Promotional Banner */}
      <section className="relative w-full py-24 bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 transform translate-x-1/4">
          <div className="w-full h-full bg-gradient-to-l from-[#f15549] to-transparent rounded-full blur-[100px]" />
        </div>
        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight">
                THE ARCHIVE ACCESS.<br />
                <span className="text-slate-400">MEMBERS GET EARLY DEALS.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium">
                Join our curated community for exclusive releases and editorial insights.
              </p>
            </div>
            <Button variant="coral" size="lg" className="px-16 py-6 text-base h-auto">
              Join the Society
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-surface">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tighter text-primary mb-4">CURATED REVIEWS</h2>
            <div className="w-12 h-1 bg-[#f15549] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The quality of the Stellar Chronograph exceeded my expectations. It feels like a piece from another era. Truly remarkable.", author: "James Sterling", role: "Collector", icon: Zap },
              { text: "Minimalism done right. The satchel is both functional and a work of art. My daily companion for years now.", author: "Elena Vance", role: "Architect", icon: Target },
              { text: "Finally an eCommerce experience that respects the artifacts it sells. The packaging alone is worth the price.", author: "Marcus Thorne", role: "Design Director", icon: ShieldCheck },
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-2xl shadow-[0px_20px_40px_rgba(49,72,101,0.04)] flex flex-col items-center text-center group transition-all hover:bg-primary hover:text-white"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                  <t.icon className="w-6 h-6 text-[#f15549]" />
                </div>
                <p className="text-slate-500 group-hover:text-slate-300 italic mb-8 leading-relaxed">"{t.text}"</p>
                <h4 className="font-black text-sm tracking-widest uppercase mb-1">{t.author}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};
