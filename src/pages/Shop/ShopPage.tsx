import ShopHero from "./components/ShopHero";
import ShopFilters from "./components/ShopFilters";
import ProductGrid from "./components/ProductGrid";

const shopData = {
  hero: {
    title: "shop.title",
    description: "shop.description",
    image: "/images/shop-banner.jpg"
  },

  filters: {
    categories: [],
    price: {
      min: 0,
      max: 1000
    }
  },

  products: [
    {
      id: "1",
      name: "products.watch",
      image: "/images/watch.jpg",
      price: 120
    },
    {
      id: "2",
      name: "products.shoes",
      image: "/images/shoes.jpg",
      price: 80
    }
  ]
};


export default function ShopPage() {
  return (
    <main>

      <ShopHero data={shopData.hero} />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[260px_1fr]">

        <ShopFilters data={shopData.filters} />

        <ProductGrid products={shopData.products} />

      </section>

    </main>
  );
}