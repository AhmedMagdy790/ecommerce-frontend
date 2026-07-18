import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddToCartProps {
  data: {
    productId: string;
    stock: boolean;
    variants?: {
      size?: string;
      color?: string;
    };
  };
}

export default function AddToCart({
  data,
}: AddToCartProps) {

  const { t } = useTranslation("product");

  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {

    const cartItem = {
      productId: data.productId,
      quantity,

      variants: data.variants
    };


    // لاحقًا تستبدلها بـ Cart API أو Zustand/Redux
    console.log(cartItem);
  }


  return (
    <div className="mt-8 flex flex-col gap-4">


      {/* Quantity */}
      <div className="flex items-center gap-4">

        <button
          onClick={() =>
            setQuantity((q) => Math.max(1, q - 1))
          }
          className="h-10 w-10 rounded-lg border"
        >
          -
        </button>


        <span className="min-w-8 text-center font-semibold">
          {quantity}
        </span>


        <button
          onClick={() =>
            setQuantity((q) => q + 1)
          }
          className="h-10 w-10 rounded-lg border"
        >
          +
        </button>

      </div>


      {/* Button */}
      <button
        disabled={!data.stock}
        onClick={handleAddToCart}
        className="
          rounded-full
          bg-primary
          px-8
          py-3
          font-semibold
          text-white
          transition
          hover:bg-primary-hover
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {data.stock
          ? t("addToCart")
          : t("outOfStock")}
      </button>


    </div>
  );
}