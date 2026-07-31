import { useSearchEngine } from "@/features/search/hooks/useSearchEngine";

// src/features/search/components/SearchBar.jsx
export const SearchBar = () => {
  const { query, results, handleInput, isOpen } = useSearchEngine();

  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search for products, brands, or SKUs..."
        onChange={(e) => handleInput(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      
      {/* Predictive Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-2xl border rounded-lg z-50">
          {results.map((product) => (
            <div key={product.id} className="p-3 hover:bg-gray-50 cursor-pointer flex gap-3">
              <img src={product.thumbnail} className="w-10 h-10 object-cover" />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};