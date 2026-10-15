// src/features/product/components/ProductStatsCards.tsx

import { memo } from "react";

import GlobalStatusBadge from "@/shared/components/GlobalStatusBadge";
import { productStatsStore } from "../../model/store/productStatusHooks";

export const ProductStatsCards = memo(
  function ProductStatsCards() {
    const stats = productStatsStore(
      (state) => state.stats
    );


    if (!stats) return null;

    const statItems = [
      {
        key: "all",
        status: "total",
        value: stats.total,
      },
      {
        key: "active",
        status: "active",
        value: stats.active,
      },
      {
        key: "draft",
        status: "draft",
        value: stats.draft,
      },
      {
        key: "archived",
        status: "archived",
        value: stats.archived,
      },
      {
        key: "trashed",
        status: "trashed",
        value: stats.trashed ?? 0,
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statItems.map((item) => {

          return (
            <div
              key={item.key}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 bg-[var(--color-surface)] shadow-sm flex items-center justify-between 
                border-[var(--color-border)] hover:border-gray-400 dark:hover:border-gray-600`}
            >
              <div>
                <GlobalStatusBadge
                  status={item.status}
                />

                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

export default ProductStatsCards;