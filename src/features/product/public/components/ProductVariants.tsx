import { useTranslation } from "react-i18next";

// interface VariantOption {
//   name: string;
//   value: string;
// }

interface ProductVariantsProps {
  data: {
    sizes?: string[];
    colors?: string[];
    options?: {
      name: string;
      values: string[];
    }[];
  };

  selected: {
    size?: string;
    color?: string;
    options?: Record<string, string>;
  };

  onChange: (
    type: string,
    value: string
  ) => void;
}

export default function ProductVariants({
  data,
  selected,
  onChange,
}: ProductVariantsProps) {

  const { t } = useTranslation("product");

  return (
    <div className="mt-8 space-y-6">


      {/* Sizes */}
      {data.sizes && (
        <div>

          <h3 className="mb-3 font-semibold text-text-primary">
            {t("size")}
          </h3>


          <div className="flex flex-wrap gap-3">

            {data.sizes.map((size) => (

              <button
                key={size}
                onClick={() =>
                  onChange("size", size)
                }
                className={`
                  rounded-lg border px-5 py-2
                  ${
                    selected.size === size
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
      {data.colors && (
        <div>

          <h3 className="mb-3 font-semibold text-text-primary">
            {t("color")}
          </h3>


          <div className="flex flex-wrap gap-3">

            {data.colors.map((color) => (

              <button
                key={color}
                onClick={() =>
                  onChange("color", color)
                }
                className={`
                  rounded-full border px-5 py-2
                  ${
                    selected.color === color
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



      {/* Dynamic Options */}
      {data.options?.map((option) => (

        <div key={option.name}>

          <h3 className="mb-3 font-semibold text-text-primary">
            {option.name}
          </h3>


          <div className="flex flex-wrap gap-3">

            {option.values.map((value) => (

              <button
                key={value}
                onClick={() =>
                  onChange(option.name, value)
                }
                className={`
                  rounded-lg border px-5 py-2
                  ${
                    selected.options?.[option.name] === value
                      ? "border-primary bg-primary text-white"
                      : "border-border"
                  }
                `}
              >
                {value}
              </button>

            ))}

          </div>

        </div>

      ))}


    </div>
  );
}