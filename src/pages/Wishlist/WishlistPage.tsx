import WishlistItem from "./components/WishlistItem";
import EmptyWishlist from "./components/EmptyWishlist";


const wishlistData = {
  items: [
    {
      id: "1",
      name: "products.leatherBag",
      image: "/images/bag.jpg",
      price: 120,
      oldPrice: 150,
      stock: true
    },
    {
      id: "2",
      name: "products.shoes",
      image: "/images/shoes.jpg",
      price: 90,
      stock: true
    }
  ]
};


export default function WishlistPage() {

  const isEmpty = wishlistData.items.length === 0;


  if (isEmpty) {
    return <EmptyWishlist />;
  }


  return (
    <main className="px-6 py-12">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-4xl font-bold text-text-primary">
          Wishlist
        </h1>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {wishlistData.items.map((product) => (

            <WishlistItem
              key={product.id}
              data={product}
            />

          ))}

        </div>

      </div>

    </main>
  );
}