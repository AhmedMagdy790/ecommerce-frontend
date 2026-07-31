import { Folder } from "lucide-react";
import { Link } from "react-router-dom";

export interface SearchCategory {
  id: number;
  name: string;
  slug: string;
}

interface SearchCategoryCardProps {
  category: SearchCategory;
}

export default function SearchCategoryCard({
  category,
}: SearchCategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="
        flex
        items-center
        gap-3
        rounded-xl
        p-3
        transition-colors
        hover:bg-[var(--color-surface)]
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          bg-[var(--color-surface-secondary)]
          text-[var(--color-text-secondary)]
        "
      >
        <Folder size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="
            truncate
            font-medium
            text-[var(--color-text-primary)]
          "
        >
          {category.name}
        </h3>
      </div>
    </Link>
  );
}