import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}


export default function ProductGrid({
  products
}: {
  products: Product[]
}) {

  const { t } = useTranslation("product");

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">

      {products.map(product => (

        <article
          key={product.id}
          className="rounded-2xl border p-4"
        >

          <img
            src={product.image}
            className="aspect-square w-full rounded-xl object-cover"
          />

          <h3 className="mt-4 font-semibold">
            {t(product.name)}
          </h3>

          <p className="mt-2 font-bold">
            ${product.price}
          </p>

        </article>

      ))}

    </div>
  );
}