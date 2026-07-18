import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductDescription from "./components/ProductDescription";
import ProductReviews from "./components/ProductReviews";
import RelatedProducts from "./components/RelatedProducts";


const productData = {
  id: "1",

  gallery: {
    images: [
      "/images/product-1.jpg",
      "/images/product-2.jpg",
      "/images/product-3.jpg"
    ]
  },

  info: {
    name: "product.name",
    description: "product.shortDescription",
    price: 120,
    oldPrice: 150,
    rating: 5,
    reviewsCount: 120,
    stock: true
  },

  variants: {
    sizes: [
      "S",
      "M",
      "L"
    ],
    colors: [
      "Black",
      "White"
    ]
  },

  description: "product.description",

  reviews: [
    {
      id: "1",
      name: "reviews.user1",
      comment: "reviews.comment1",
      rating: 5
    }
  ],

  relatedProducts: []
};


export default function ProductPage() {

  return (
    <main className="px-6 py-12">

      <div className="mx-auto max-w-7xl">

        {/* Main Product */}
        <section className="grid gap-10 lg:grid-cols-2">

          <ProductGallery
            data={productData.gallery}
          />


          <ProductInfo
            data={{
              ...productData.info,
              variants: productData.variants
            }}
          />

        </section>


        {/* Description */}
        <ProductDescription
          data={{
            description: productData.description
          }}
        />


        {/* Reviews */}
        <ProductReviews
          data={{
            reviews: productData.reviews
          }}
        />


        {/* Related */}
        <RelatedProducts
          data={{
            products: productData.relatedProducts
          }}
        />

      </div>

    </main>
  );
}