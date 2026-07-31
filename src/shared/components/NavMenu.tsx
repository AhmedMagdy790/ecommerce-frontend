// src/features/navbar/components/NavMenu.tsx
import { useCategoryStore } from "@/features/category/store/useCategoryStore";

export const NavMenu: React.FC = () => {
  // Use a selector to ensure we only re-render when the public categories change
  const categories = useCategoryStore((state) => state.categories);

  return (
    <ul className="flex gap-6">
      {categories.map((category) => (
        <li key={category.id} className="group relative">
          <a href={category?.url} className="hover:text-blue-600 font-medium">
            {category.name}
          </a>
          
          {/* Mega Menu Dropdown */}
          <div className="absolute left-0 top-full hidden w-[600px] bg-white border shadow-xl p-6 group-hover:grid grid-cols-3 gap-4">
            {/* {category.subCategories.map((sub) => (
              <div key={sub.id}>
                <h4 className="font-bold mb-2">{sub.name}</h4>
                {sub.items.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    className="block text-sm text-gray-600 hover:text-blue-600"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))} */}
          </div>
        </li>
      ))}
    </ul>
  );
};