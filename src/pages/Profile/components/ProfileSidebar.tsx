
import { memo, useRef } from "react";
import { type LucideIcon } from "lucide-react";
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

    const normalizedIndex =
      (index + tabs.length) % tabs.length;

    const tab = tabs[normalizedIndex];

    onSelectTab(tab.id);
    tabRefs.current[normalizedIndex]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + (isRTL ? -1 : 1));
        return;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index + (isRTL ? 1 : -1));
        return;
      case "Home":
        event.preventDefault();
        focusTab(0);
        return;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        return;
      default:
        return;
    }
  };

  return (
    <aside dir={isRTL ? "rtl" : "ltr"} className="w-full">
      <nav
        role="tablist"
        aria-label={t("navigationLabel")}
        aria-orientation="horizontal"
        className="
          flex gap-2 rounded-panel border border-border
          bg-surface p-3 shadow-xs transition-colors
          lg:flex-col
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
                "flex w-full cursor-pointer items-start gap-3.5 rounded-card border p-3.5 text-start transition-colors",
                active
                  ? "border-border bg-background text-text-primary shadow-xs"
                  : "border-transparent bg-transparent text-text-secondary hover:bg-surface-secondary",
              ].join(" ")}
            >
              <Icon
                className={[
                  "mt-0.5 size-5 shrink-0 transition-colors",
                  active ? "text-primary" : "text-text-muted",
                ].join(" ")}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <h3
                  className={[
                    "truncate text-sm font-semibold",
                    active
                      ? "text-text-primary"
                      : "text-text-secondary",
                  ].join(" ")}
                  style={{ fontFamily }}
                >
                  {tab.label}
                </h3>

                <p
                  className="mt-0.5 line-clamp-1 text-xs font-medium text-text-muted"
                  style={{ fontFamily }}
                >
                  {tab.description}
                </p>
              </div>
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
