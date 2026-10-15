// دالة مساعدة للوصول للخصائص المتداخلة (مثل product_variant.sku)
function getNestedValue(obj: any, path: string): unknown {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function filterItems<T>(
  items: T[],
  search: string,
  filters: Record<string, unknown>,
  searchableFields: (keyof T | string)[] = []
): T[] {

  return items.filter((item) => {
    // =========================
    // Search
    // =========================
    if (search.trim() && searchableFields.length > 0) {
      const searchValue = search.toLowerCase();

      const matchesSearch = searchableFields.some((field) => {
        const fieldStr = String(field);
        const value = fieldStr.includes(".")
          ? getNestedValue(item, fieldStr)
          : item[field as keyof T];

        return (
          value != null &&
          String(value)
            .toLowerCase()
            .includes(searchValue)
        );
      });

      if (!matchesSearch) {
        return false;
      }
    }

    // =========================
    // Filters
    // =========================
    const matchesFilters = Object.entries(filters).every(
      ([key, value]) => {
        if (value === "" || value == null) {
          return true;
        }

        const itemValue = key.includes(".")
          ? getNestedValue(item, key)
          : item[key as keyof T];

        return (
          itemValue != null &&
          String(itemValue).toLowerCase() ===
            String(value).toLowerCase()
        );
      }
    );

    return matchesFilters;
  });
}