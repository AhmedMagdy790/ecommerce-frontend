export default function cdHero() {
  const products = [
    {
      name: "Premium Product",
      image: "https://picsum.photos/400/500?random=1",
    },
    {
      name: "New Collection",
      image: "https://picsum.photos/400/500?random=2",
    },
    {
      name: "Best Seller",
      image: "https://picsum.photos/400/500?random=3",
    },
  ];

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">

        {/* Content */}
        <div>
          <span className="text-sm uppercase tracking-widest text-gray-500">
            Our Collection
          </span>

          <h1 className="mt-4 text-5xl font-bold text-gray-900">
            Everything You Love In One Place
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Discover our curated products made for your lifestyle.
          </p>

          <button className="mt-8 rounded-full bg-black px-8 py-3 text-white">
            Explore Now
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full object-cover"
              />

              <p className="p-3 text-sm font-medium">
                {product.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}