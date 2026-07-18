import SearchEmpty from "./SearchEmpty";
import SearchLoading from "./SearchLoading";
import SearchProductCard, {
  type SearchProduct,
} from "./SearchProductCard";
import SearchCategoryCard, {
  type SearchCategory,
} from "./SearchCategoryCard";

interface SearchResultsProps {
  loading: boolean;
  hasSearched: boolean;
  query: string;
  products: SearchProduct[];
  categories: SearchCategory[];
}

export default function SearchResults({
  loading,
  query,
  products,
  categories,
  hasSearched
}: SearchResultsProps) {

  if (loading) {
    return <SearchLoading />;
  }
  
  if (!hasSearched) {
    return null;
  }
      

  const hasResults =
    products.length > 0 || categories.length > 0;

  if (!hasResults && query.trim() !== "") {
    return <SearchEmpty query={query} />;
  }

  return (
    <div className="space-y-6">
      {products.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">
            Products
          </h2>

          <div className="space-y-2">
            {products.map((product) => (
              <SearchProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">
            Categories
          </h2>

          <div className="space-y-2">
            {categories.map((category) => (
              <SearchCategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}