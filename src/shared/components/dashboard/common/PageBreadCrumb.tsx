import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[];
}



const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  items = [],
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

      {/* Title */}
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {pageTitle}
      </h1>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">

          {/* Home */}
          <li>
            <Link
              to="/"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)]"
            >
              Home
            </Link>
          </li>

          {/* Dynamic Items */}
          {items.map((item, index) => (
            <li
              key={item.href ?? `${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              <ChevronRight
                size={16}
                className="shrink-0 text-[var(--color-text-muted)] rtl:rotate-180"
              />

              {item.href ? (
                <Link
                  to={item.href}
                  className="
                        text-[var(--color-text-secondary)]
                        hover:text-[var(--color-text-primary)]
                        transition-colors
                    "
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--color-text-primary)] font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}

          {/* Current Page */}
          <li className="flex items-center gap-2">
              <ChevronRight
                size={16}
                className="shrink-0 text-[var(--color-text-muted)] rtl:rotate-180"
              />

            <span className="text-[var(--color-text-primary)] font-semibold">
              {pageTitle}
            </span>
          </li>

        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;