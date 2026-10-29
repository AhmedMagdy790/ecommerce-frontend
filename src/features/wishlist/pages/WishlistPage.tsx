import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

import Spinner from "@/shared/components/Spinner";

export default function WishlistPage() {
  const { wishlistItems, isLoading } = useWishlist();

  
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
        {wishlistItems.map((item) => {
          const product = item.product;
          const productName = product.name;

          const image =
            product.thumbnail ||
            product.featured_image ||
            "/images/placeholders/product.webp";

          return (
            <div key={item.id}>
              <img
                src={image}
                alt={productName}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h3 className="font-semibold text-lg mb-1">
                {productName}
              </h3>

              <p className="text-primary font-bold mb-4">
                {product.price ?? product.starting_at ?? "—"}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
}