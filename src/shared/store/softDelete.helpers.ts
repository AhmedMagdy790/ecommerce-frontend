// src/shared/store/softDelete.helpers.ts

import type { Draft } from "immer";

/**
 * دالة عامة لتحديث الإحصائيات عند نقل عنصر للسلة (نقصان الفعال/الغير فعال وزيادة المحذوف)
 */
export function handleItemTrashedStats<TState extends { stats?: { active: number; inactive: number; trashed: number } }>(
  isActive: boolean | number,
  state: Draft<TState>
) {
  if (!state.stats) return;

  if (isActive) {
    state.stats.active = Math.max(0, state.stats.active - 1);
  } else {
    state.stats.inactive = Math.max(0, state.stats.inactive - 1);
  }
  state.stats.trashed += 1;
}

/**
 * دالة عامة لتحديث الإحصائيات عند استعادة عنصر من السلة
 */
export function handleItemRestoredStats<TState extends { stats?: { active: number; inactive: number; trashed: number } }>(
  isActive: boolean | number,
  state: Draft<TState>
) {
  if (!state.stats) return;

  state.stats.trashed = Math.max(0, state.stats.trashed - 1);
  if (isActive) {
    state.stats.active += 1;
  } else {
    state.stats.inactive += 1;
  }
}

/**
 * دالة عامة لتحديث الإحصائيات عند الحذف النهائي لعنصر من السلة
 */
export function handleItemForceDeletedStats<TState extends { stats?: { trashed: number } }>(
  state: Draft<TState>
) {
  if (!state.stats) return;
  state.stats.trashed = Math.max(0, state.stats.trashed - 1);
}