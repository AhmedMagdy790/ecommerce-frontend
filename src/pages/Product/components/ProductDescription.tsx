import { useTranslation } from "react-i18next";

interface ProductDescriptionProps {
  data: {
    description: string;
    details?: {
      title: string;
      value: string;
    }[];
  };
}

export default function ProductDescription({
  data,
}: ProductDescriptionProps) {

  const { t } = useTranslation("product");

  return (
    <section className="mt-16 border-t border-border pt-10">

      <h2 className="mb-6 text-2xl font-bold text-text-primary">
        {t("description.title")}
      </h2>


      {/* Description */}
      <p className="max-w-4xl leading-relaxed text-text-secondary">
        {t(data.description)}
      </p>


      {/* Details */}
      {data.details && data.details.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">

          {data.details.map((item, index) => (
            <div
              key={index}
              className="flex justify-between rounded-xl border border-border bg-surface p-4"
            >

              <span className="font-medium text-text-primary">
                {t(item.title)}
              </span>

              <span className="text-text-secondary">
                {t(item.value)}
              </span>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}