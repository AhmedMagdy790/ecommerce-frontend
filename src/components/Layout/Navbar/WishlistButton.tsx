import { Link } from "react-router-dom";

export default function WishlistButton() {
  return (
    <Link
      to="/wishlist"
      className="
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        hover:bg-surface-secondary
      "
      aria-label="Wishlist"
    >
      ♡
    </Link>
  );
}