import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { TranslatedText } from "@/shared/types/types";
import {
  ProductStatus,
  type Product,
  type ProductStats,
} from "../types/product.types";

export const productStatsStore =
  createEntityStatsStore<ProductStats>();

export const productStatusHooks = {
  onFetched: (stats: ProductStats | null | undefined) => {
    if (!stats) return;

    productStatsStore.getState().setStats(stats);
  },

  onCreated: (item: Product<TranslatedText>) => {
    const store = productStatsStore.getState();

    store.increment("total");

    if (item.status === ProductStatus.ACTIVE) {
      store.increment("active");
    } else if (item.status === ProductStatus.DRAFT) {
      store.increment("draft");
    } else if (item.status === ProductStatus.ARCHIVED) {
      store.increment("archived");
    }
  },

  onRestored: (item: Product<TranslatedText>) => {
    const store = productStatsStore.getState();
    store.increment("total");
    store.decrement("trashed");
    if (item.status === ProductStatus.ACTIVE) {
      store.increment("active");
    } else if (item.status === ProductStatus.DRAFT) {
      store.increment("draft");
    } else if (item.status === ProductStatus.ARCHIVED) {
      store.increment("archived");
    }
  },

  onDeleted: (_id: number | string, previousItem?: Product<TranslatedText>) => {
    if (!previousItem) return;

    const store = productStatsStore.getState();

    store.decrement("total");
    store.increment("trashed");

    if (previousItem.status === ProductStatus.ACTIVE) {
      store.decrement("active");
    } else if (previousItem.status === ProductStatus.DRAFT) {
      store.decrement("draft");
    } else if (previousItem.status === ProductStatus.ARCHIVED) {
      store.decrement("archived");
    }
  },

  onForceDeleted: (_id: number | string, previousItem?: Product<TranslatedText>) => {
    // إذا لم يكن لدينا الكائن السابق، فلا يمكننا معرفة حالته بدقة
    if (!previousItem) return;

    const store = productStatsStore.getState();

    store.decrement("trashed");
  },

  onToggled: (item: Product<TranslatedText>, previousStatus: ProductStatus) => {
    const store = productStatsStore.getState();


    if (previousStatus === ProductStatus.ACTIVE) {
      store.decrement("active");
    } else if (previousStatus === ProductStatus.DRAFT) {
      store.decrement("draft");
    } else if (previousStatus === ProductStatus.ARCHIVED) {
      store.decrement("archived");
    }

    if (item.status === ProductStatus.ACTIVE) {
      store.increment("active");
    } else if (item.status === ProductStatus.DRAFT) {
      store.increment("draft");
    } else if (item.status === ProductStatus.ARCHIVED) {
      store.increment("archived");
    }
  },
};