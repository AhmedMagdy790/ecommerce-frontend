// src/features/order/types/index.ts

export interface OrderSummary {
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string | number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string; // ISO Date string
  summary: OrderSummary;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    country: string;
  };
}