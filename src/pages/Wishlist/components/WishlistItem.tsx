import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface WishlistItemProps {
  data: {
    id: string;
    slug?: string;
    name: string;
    image: string;
    price: number;
    oldPrice?: number;
    stock: boolean;
  };

  onRemove?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}


export default function WishlistItem({
  data,
  onRemove,
  onAddToCart,
}: WishlistItemProps) {

  const { t } = useTranslation("product");


  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">


      {/* Image */}
      <Link
        to={`/products/${data.slug || data.id}`}
        className="block aspect-square overflow-hidden bg-surface-secondary"
      >

        <img
          src={data.image}
          alt={t(data.name)}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            hover:scale-105
          "
          loading="lazy"
        />

      </Link>



      {/* Content */}
      <div className="p-5">


        <Link
          to={`/products/${data.slug || data.id}`}
        >
          <h3 className="font-semibold text-text-primary">
            {t(data.name)}
          </h3>
        </Link>



        {/* Price */}
        <div className="mt-3 flex items-center gap-3">

          <span className="font-bold text-primary">
            ${data.price}
          </span>


          {data.oldPrice && (
            <span className="text-sm text-text-secondary line-through">
              ${data.oldPrice}
            </span>
          )}

        </div>



        {/* Actions */}
        <div className="mt-5 flex gap-3">


          <button
            disabled={!data.stock}
            onClick={() =>
              onAddToCart?.(data.id)
            }
            className="
              flex-1
              rounded-full
              bg-primary
              py-2
              font-semibold
              text-white
              disabled:opacity-50
            "
          >
            {t("addToCart")}
          </button>



          <button
            onClick={() =>
              onRemove?.(data.id)
            }
            className="
              rounded-full
              border
              border-border
              px-4
              text-red-500
            "
          >
            ♡
          </button>


        </div>


      </div>


    </article>
  );
}