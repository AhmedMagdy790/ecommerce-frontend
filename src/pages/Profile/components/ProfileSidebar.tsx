
import { memo, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface ProfileSidebarProps<T extends string> {
  tabs: readonly TabItem<T>[];
  activeTab: T;
  onSelectTab: (id: T) => void;
}

function ProfileSidebarComponent<T extends string>({
  tabs,
  activeTab,
  onSelectTab,
}: ProfileSidebarProps<T>) {
  const { isRTL, t } = useLang();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const fontFamily = isRTL
    ? "var(--font-arabic)"
    : "var(--font-sans)";

  const focusTab = (index: number) => {
    if (tabs.length === 0) return;

    const normalizedIndex = (index + tabs.length) % tabs.length;

    onSelectTab(tabs[normalizedIndex].id);
    tabRefs.current[normalizedIndex]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + (isRTL ? -1 : 1));
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index + (isRTL ? 1 : -1));
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  };

  return (
    <aside dir={isRTL ? "rtl" : "ltr"} className="w-full min-w-0">
      <nav
        role="tablist"
        aria-label={t("navigationLabel")}
        aria-orientation="horizontal"
        className="
          flex w-full gap-2 overflow-x-auto rounded-panel
          border border-border bg-surface p-2 shadow-xs
          scrollbar-none
          lg:flex-col lg:gap-1.5 lg:p-3
        "
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              type="button"
              className={[
                "relative flex min-w-0 shrink-0 items-center gap-2",
                "rounded-control border px-3 py-2.5 text-start",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-offset-2",
                "sm:gap-3 sm:px-3.5",
                "lg:w-full lg:shrink lg:items-start lg:py-3",
                active
                  ? "border-border bg-background text-text-primary shadow-xs"
                  : "border-transparent text-text-secondary hover:bg-surface-secondary",
              ].join(" ")}
            >
              <span
                className={[
                  "flex size-9 shrink-0 items-center justify-center",
                  "rounded-control transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-secondary text-text-muted",
                ].join(" ")}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1 lg:pt-0.5">
                <span
                  className="block truncate text-xs font-semibold sm:text-sm"
                  style={{ fontFamily }}
                >
                  {tab.label}
                </span>

                <span
                  className="mt-1 hidden line-clamp-2 text-xs leading-5 text-text-muted lg:block"
                  style={{ fontFamily }}
                >
                  {tab.description}
                </span>
              </span>

              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 start-0 hidden w-0.5 rounded-full bg-primary lg:block"
                />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export const ProfileSidebar = memo(
  ProfileSidebarComponent,
) as typeof ProfileSidebarComponent;