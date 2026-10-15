import { useEffect, useCallback, useMemo } from "react";
import type { TranslatedText } from "@/shared/types/types";
import { useNavigationItemStore } from "../../model/store/useNavigationItemStore";
import type { NavMenuItem } from "../../model/types/navigation.types";


export function useNavigationItemsManager(menuId: number | null) {
  // جلب الحالة والأسماء الصحيحة المتوافقة مع createFeatureStore
  const items = useNavigationItemStore((state) => state.items);
  const isLoading = useNavigationItemStore((state) => state.isLoading);
  const error = useNavigationItemStore((state) => state.error);
  const fetchItemsAction = useNavigationItemStore((state) => state.fetch); // عادة اسم دالة الجلب في الـ store هي fetch
  const deleteItemAction = useNavigationItemStore((state) => state.delete); // عادة اسم دالة الحذف هي delete

  const fetchItems = useCallback(async () => {
    if (!menuId) return;
    if (fetchItemsAction) {
      await fetchItemsAction({ nav_menu_id: menuId });
    }
  }, [menuId, fetchItemsAction]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteItem = async (itemId: number | string) => {
    try {
      if (deleteItemAction) {
        await deleteItemAction(itemId);
      }
      fetchItems();
    } catch (err) {
      console.error("Failed to delete navigation item:", err);
    }
  };

  const handleUpdateItemOrder = async (itemId: number | string, newSortOrder: number) => {
    await fetchItems();
    void itemId;
    void newSortOrder;
  };

  const treeItems = useMemo(() => {
    const map = new Map<number, NavMenuItem<TranslatedText> & { children?: any[] }>();
    const roots: any[] = [];

    items.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    items.forEach((item) => {
      const node = map.get(item.id);
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [items]);

  return {
    items,
    treeItems,
    isLoading,
    error,
    refetch: fetchItems,
    handleDeleteItem,
    handleUpdateItemOrder,
  };
}