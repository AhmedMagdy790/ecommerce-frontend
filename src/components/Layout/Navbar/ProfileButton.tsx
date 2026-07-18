import { Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function ProfileButton() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="
          inline-flex
          h-10
          items-center
          justify-center
          rounded-lg
          border
          border-border
          px-4
          text-sm
          font-medium
          text-text-primary
          transition-colors
          hover:bg-surface
        "
      >
        Sign In
      </Link>
    );
  }

  return (
    <Link
      to="/profile"
      className="
        inline-flex
        h-10
        items-center
        gap-2
        rounded-lg
        px-2
        transition-colors
        hover:bg-surface
      "
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-primary
            text-sm
            font-semibold
            text-text-inverse
          "
        >
          {user?.name.charAt(0).toUpperCase()}
        </div>
      )}

      <span className="hidden xl:block text-sm font-medium">
        {user?.name}
      </span>
    </Link>
  );
}