import { prependItem, removeItemById, incrementTotal, decrementTotal } from "./crud.helpers";


export async function handleOptimisticDelete<T extends { id: number | string }>(
    get: any,
    set: any,
    id: number | string,
    removeApi: (id: number | string) => Promise<any>,
    errorMessage: string
) {
    const targetItem = get().items.find((x: T) => x.id === id);
    if (!targetItem) return;

    set((state: any) => ({
        items: removeItemById(state.items, id),
        trashedItems: prependItem(state.trashedItems, targetItem),
        pagination: decrementTotal(state.pagination),
    }));

    try {
        await removeApi(id);
    } catch (error) {
        set((state: any) => ({
            items: prependItem(state.items, targetItem),
            trashedItems: removeItemById(state.trashedItems, id),
            pagination: incrementTotal(state.pagination),
            error: error instanceof Error ? error.message : errorMessage,
        }));
        throw error;
    }
}

export async function handleOptimisticRestore<T extends { id: number | string }>(
    get: any,
    set: any,
    id: number | string,
    restoreApi: (id: number | string) => Promise<any>,
    errorMessage: string
) {
    const targetItem = get().trashedItems.find((x: T) => x.id === id);
    if (!targetItem) return;

    set((state: any) => ({
        items: prependItem(state.items, targetItem),
        trashedItems: removeItemById(state.trashedItems, id),
        pagination: incrementTotal(state.pagination),
    }));

    try {
        await restoreApi(id);
    } catch (error) {
        set((state: any) => ({
            items: removeItemById(state.items, id),
            trashedItems: prependItem(state.trashedItems, targetItem),
            pagination: decrementTotal(state.pagination),
            error: error instanceof Error ? error.message : errorMessage,
        }));
        throw error;
    }
}