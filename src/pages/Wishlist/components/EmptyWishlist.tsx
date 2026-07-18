import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function EmptyWishlist() {

  const { t } = useTranslation("wishlist");


  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">

      {/* Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-secondary text-4xl">
        ♡
      </div>


      {/* Title */}
      <h1 className="text-3xl font-bold text-text-primary">
        {t("empty.title")}
      </h1>


      {/* Description */}
      <p className="mt-3 max-w-md text-text-secondary">
        {t("empty.description")}
      </p>


      {/* Action */}
      <Link
        to="/shop"
        className="
          mt-8
          rounded-full
          bg-primary
          px-8
          py-3
          font-semibold
          text-white
          transition
          hover:bg-primary-hover
        "
      >
        {t("empty.button")}
      </Link>


    </section>
  );
}