// src/features/navbar/components/Navbar.jsx
import { useNavbarData } from '@/features/navbar/hooks/useNavbarData';
import { NavMenu } from './NavMenu';
import { SearchBar } from './SearchBar';
import { NavbarSkeleton } from '@/features/navbar/components/NavbarSkeleton';
import { NavbarFallback } from '@/features/navbar/components/NavbarFallback';
import { useCartStore } from '@/features/cart/store/ cartStore';




const Navbar = () => {
  const { data, isLoading, isError } = useNavbarData();
  const cartCount = useCartStore((state) => 
    state.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );

  if (isLoading) return <NavbarSkeleton />;
  if (isError) return <NavbarFallback />;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">BRAND</div>
        
        {/* Main Category Menu */}
        <NavMenu categories={data} />
        
        <div className="flex items-center gap-4">
          <SearchBar />
          <button className="relative">Cart {`(${cartCount})`}</button>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;