import { memo } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <aside className="w-full">
      <nav 
        role="tablist" 
        aria-label="Profile Navigation"
        className="flex lg:flex-col gap-2 p-3 transition-all"
        style={{ 
          backgroundColor: "var(--color-surface)", 
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              role="tab"
              aria-selected={active}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              className="w-full flex items-start gap-3.5 p-3.5 transition-all text-left cursor-pointer"
              style={{
                backgroundColor: active ? "var(--color-background)" : "transparent",
                border: active ? "1px solid var(--color-border)" : "1px solid transparent",
                borderRadius: "var(--radius-xl)",
                boxShadow: active ? "var(--shadow-xs)" : "none"
              }}
            >
              <Icon
                className="size-5 mt-0.5 shrink-0 transition-colors"
                style={{ 
                  color: active ? "var(--color-primary)" : "var(--color-text-muted)" 
                }}
                aria-hidden="true" 
              />

              {/* تصحيح الـ ID بحيث يكون فريداً لكل عنصر بدلاً من ربطه بـ activeTab العام */}
              <div className="min-w-0 flex-1">
                <h3 
                  className="font-medium truncate"
                  style={{ 
                    fontSize: "var(--text-sm)", 
                    color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)" 
                  }}
                >
                  {tab.label}
                </h3>

                <p 
                  className="mt-0.5 line-clamp-1"
                  style={{ 
                    fontSize: "var(--text-xs)", 
                    color: "var(--color-text-muted)" 
                  }}
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

export const ProfileSidebar = memo(ProfileSidebarComponent) as typeof ProfileSidebarComponent;