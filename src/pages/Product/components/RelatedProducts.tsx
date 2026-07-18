import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  link?: string;
}

interface RelatedProductsProps {
  data: {
    title?: string;
    products: Product[];
  };
}

export default function RelatedProducts({
  data,
}: RelatedProductsProps) {

  const { t } = useTranslation("product");


  if (!data.products.length) {
    return null;
  }


  return (
    <section className="mt-16 border-t border-border pt-10">

      {/* Header */}
      <h2 className="mb-8 text-2xl font-bold text-text-primary">
        {data.title
          ? t(data.title)
          : t("relatedProducts.title")}
      </h2>


      {/* Products */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">

        {data.products.map((product) => (

          <a
            key={product.id}
            href={product.link || "#"}
            className="group overflow-hidden rounded-2xl border border-border bg-surface"
          >

            {/* Image */}
            <div className="aspect-square overflow-hidden bg-surface-secondary">

              <img
                src={product.image}
                alt={t(product.name)}
                className="
                  h-full
                  w-full
                  object-cover
                  transition
                  duration-500
                  group-hover:scale-105
                "
                loading="lazy"
              />

            </div>


            {/* Info */}
            <div className="p-4">

              <h3 className="font-semibold text-text-primary">
                {t(product.name)}
              </h3>


              <div className="mt-2 flex items-center gap-2">

                <span className="font-bold text-primary">
                  ${product.price}
                </span>


                {product.oldPrice && (
                  <span className="text-sm text-text-secondary line-through">
                    ${product.oldPrice}
                  </span>
                )}

              </div>

            </div>


          </a>

        ))}

      </div>

    </section>
  );
}