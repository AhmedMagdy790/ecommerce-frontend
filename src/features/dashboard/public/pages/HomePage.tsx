import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones } from 'lucide-react'; // أيقونات احترافية
import { Container } from '@/shared/components/Container';
import Hero from '../components/Hero';
import { useState } from 'react';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import { useCartStore } from '@/features/cart/store/ cartStore';
import { IProduct } from '@/features/products/types/types';
import PromoBanner from '../components/PromoBanner';
import BestSellers from '../components/BestSellers';

const FEATURE_ITEMS = [
  { icon: Truck, title: 'شحن سريع', desc: 'توصيل لباب المنزل في أسرع وقت' },
  { icon: Headphones, title: 'دعم فني', desc: 'خدمة عملاء جاهزة دائماً' },
  { icon: ShieldCheck, title: 'دفع آمن', desc: 'وسائل دفع متنوعة وآمنة' },
];

const HomePage = () => {

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  const {items, addToCart} = useCartStore();


  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const target = document.getElementById('featured-products-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleWishlist = (product: IProduct) => {
    setWishlistIds((prev) => {
      const isSaved = prev.includes(product.id);
      if (isSaved) {
      
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  return (
    <div className="space-y-24 py-12">

      <Hero
        onShopClick={() => handleSelectCategory('all')}
        onExploreClick={() => handleSelectCategory('Fashion')}
      />

      <Categories onSelectCategory={handleSelectCategory} />

      <FeaturedProducts
        onAddToCart={addToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewProduct}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
      />

      <PromoBanner onShopPromoClick={() => handleSelectCategory('all')} />

        <BestSellers
          onAddToCart={addToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onQuickView={setQuickViewProduct}
        />
    </div>
  );
};

export default HomePage;