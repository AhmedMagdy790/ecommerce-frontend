import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

import { useCart } from "@/pages/Cart/hook/useCart";
import Spinner from "@/shared/components/Spinner";

export default function WishlistPage() {
  const { wishlistItems, isLoading, removeFromWishlist, moveToCart, isRemoving } = useWishlist();
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  // حالة المفضلة الفارغة
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">قائمة الرغبات فارغة</h2>
        <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى المفضلة بعد.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">قائمة الرغبات ({wishlistItems.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div>
              <img src={item.product.image} alt={item.product.name} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
              <p className="text-primary font-bold mb-4">{item.product.price} ر.س</p>
            </div>

            <div className="flex gap-2">
              {/* زر النقل للسلة */}
              <button
                onClick={() => moveToCart({ productId: item.product.id, cartServiceFn: addToCart })}
                className="flex-1 bg-primary text-white py-2 px-4 rounded text-sm hover:opacity-90 transition"
              >
                نقل للسلة
              </button>

              {/* زر الحذف */}
              <button
                onClick={() => removeFromWishlist(item.product.id)}
                disabled={isRemoving}
                className="border border-red-500 text-red-500 py-2 px-3 rounded text-sm hover:bg-red-50 transition"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}