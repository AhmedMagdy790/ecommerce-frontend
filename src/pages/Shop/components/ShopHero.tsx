import { useTranslation } from "react-i18next";

interface Props {
  data: {
    title: string;
    description: string;
    image: string;
  };
}

export default function ShopHero({ data }: Props) {

  const { t } = useTranslation("shop");

  return (
    <section className="relative h-[350px] overflow-hidden">

      <img
        src={data.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 text-white">
        <h1 className="text-5xl font-bold">
          {t(data.title)}
        </h1>

        <p className="mt-4 max-w-xl text-lg">
          {t(data.description)}
        </p>
      </div>

    </section>
  );
}