import { useState } from "react";
import { useTranslation } from "react-i18next";
import AddToCart from "./AddToCart";

interface ProductInfoProps {
  data: {
    id: string;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewsCount: number;
    stock: boolean;

    variants?: {
      sizes?: string[];
      colors?: string[];
    };
  };
}

export default function ProductInfo({
  data,
}: ProductInfoProps) {

  const { t } = useTranslation("product");


  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();


  return (
    <div className="flex flex-col">


      {/* Name */}
      <h1 className="text-3xl font-bold text-text-primary md:text-5xl">
        {t(data.name)}
      </h1>


      {/* Rating */}
      <div className="mt-4 flex items-center gap-2">

        <div className="flex text-yellow-500">
          {Array.from({
            length: data.rating
          }).map((_, index) => (
            <span key={index}>
              ★
            </span>
          ))}
        </div>

        <span className="text-sm text-text-secondary">
          ({data.reviewsCount} {t("reviews")})
        </span>

      </div>



      {/* Price */}
      <div className="mt-6 flex items-center gap-3">

        <span className="text-3xl font-bold text-primary">
          ${data.price}
        </span>


        {data.oldPrice && (
          <span className="text-lg text-text-secondary line-through">
            ${data.oldPrice}
          </span>
        )}

      </div>



      {/* Short Description */}
      <p className="mt-6 leading-relaxed text-text-secondary">
        {t(data.description)}
      </p>



      {/* Sizes */}
      {data.variants?.sizes && (
        <div className="mt-8">

          <h3 className="mb-3 font-semibold">
            {t("size")}
          </h3>


          <div className="flex gap-3">

            {data.variants.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  rounded-lg border px-4 py-2
                  ${
                    selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-border"
                  }
                `}
              >
                {size}
              </button>
            ))}

          </div>

        </div>
      )}



      {/* Colors */}
      {data.variants?.colors && (
        <div className="mt-6">

          <h3 className="mb-3 font-semibold">
            {t("color")}
          </h3>


          <div className="flex gap-3">

            {data.variants.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`
                  rounded-full border px-5 py-2
                  ${
                    selectedColor === color
                      ? "border-primary bg-primary text-white"
                      : "border-border"
                  }
                `}
              >
                {color}
              </button>
            ))}

          </div>

        </div>
      )}



      {/* Add Cart */}
      <AddToCart
        data={{
          productId: data.id,
          stock: data.stock,
          variants: {
            size: selectedSize,
            color: selectedColor
          }
        }}
      />


    </div>
  );
}