interface ProductPriceProps {
  data: {
    price: number;
    oldPrice?: number;
    currency?: string;
    discount?: number;
  };
}

export default function ProductPrice({
  data,
}: ProductPriceProps) {

  return (
    <div className="flex items-center gap-3">

      {/* Current Price */}
      <span className="text-3xl font-bold text-primary">
        {data.currency || "$"}
        {data.price}
      </span>


      {/* Old Price */}
      {data.oldPrice && (
        <span className="text-lg text-text-secondary line-through">
          {data.currency || "$"}
          {data.oldPrice}
        </span>
      )}


      {/* Discount Badge */}
      {data.discount && (
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
          -{data.discount}%
        </span>
      )}

    </div>
  );
}