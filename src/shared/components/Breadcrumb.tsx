// src/shared/components/Breadcrumb.tsx
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const { lang } = useLang();
    const isAr = lang === "ar";

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-[var(--color-text-secondary)]">
            <ol className="flex items-center gap-2 flex-wrap">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {index > 0 && (
                                <span className="text-[var(--color-text-muted)] select-none">
                                    {isAr ? (
                                        <ChevronLeft className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </span>
                            )}
                            {item.href && !isLast ? (
                                <Link
                                    to={item.href}
                                    className="hover:text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)]"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className={
                                        isLast
                                            ? "font-medium text-[var(--color-text-primary)]"
                                            : ""
                                    }
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}