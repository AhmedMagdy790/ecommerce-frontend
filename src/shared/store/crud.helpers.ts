import type { PaginationMeta } from "../types/api.types";

export const incrementTotal = (pagination: PaginationMeta): PaginationMeta => ({
    ...pagination,
    total: pagination.total + 1,
});

export const decrementTotal = (pagination: PaginationMeta): PaginationMeta => ({
    ...pagination,
    total: Math.max(0, pagination.total - 1),
});

export function removeItemById<T extends { id: number | string }>(
    items: T[],
    id: number | string
): T[] {
    return items.filter(item => item.id !== id);
}

export function prependItem<T>(items: T[], item: T): T[] {
    return [item, ...items];
}

export function updateEntity<T extends { id: number | string }>(
    items: T[],
    updated: T
): T[] {
    return items.map(item =>
        item.id === updated.id ? { ...item, ...updated } : item
    );
}
