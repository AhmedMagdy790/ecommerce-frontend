import { faker } from '@faker-js/faker';

export const MOCK_PRODUCTS = Array.from({ length: 8 }).map((_, index) => ({
  id: `${index + 1}`,
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category_id: (index % 3 + 1).toString(), // توزيع عشوائي على التصنيفات
  image: `https://picsum.photos/seed/${index}/400/400`,
  inStock: true
}));