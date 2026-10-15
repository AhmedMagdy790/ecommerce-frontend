// shared/store/entity.ts
export function replaceEntity<T extends { id: number | string }>(
  items: T[],
  id: number | string,
  entity: Partial<T>
): T[] {
  const index = items.findIndex(item => item.id === id);

  if (index === -1) return items;

  const copy = [...items];
  copy[index] = {
    ...copy[index],
    ...entity,
  };

  return copy;
}