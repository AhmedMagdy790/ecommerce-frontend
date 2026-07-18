import type { SearchProduct } from "@/components/Search/SearchProductCard";
import type { SearchCategory } from "@/components/Search/SearchCategoryCard";

export const fakeProducts: SearchProduct[] = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    image: "https://via.placeholder.com/64",
    price: 999,
    currency: "USD",
  },
  {
    id: 2,
    name: "MacBook Air M4",
    slug: "macbook-air-m4",
    image: "https://via.placeholder.com/64",
    price: 1299,
    currency: "USD",
  },
  {
    id: 3,
    name: "AirPods Pro",
    slug: "airpods-pro",
    image: "https://via.placeholder.com/64",
    price: 249,
    currency: "USD",
  },
];

export const fakeCategories: SearchCategory[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
  },
  {
    id: 2,
    name: "Laptops",
    slug: "laptops",
  },
  {
    id: 3,
    name: "Accessories",
    slug: "accessories",
  },
];