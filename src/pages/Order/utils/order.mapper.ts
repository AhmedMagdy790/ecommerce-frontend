// pages/Order/utils/order.mapper.ts

import type { Order, OrderItem, OrderStatus } from "@/features/order/model/types/order.types";

export interface RawOrder {
  id: number;
  order_number: string;
  coupon_id: number | null;
  customer: {
    name: string;
    phone_primary: string;
    phone_secondary: string | null;
    email: string;
    type: string;
  };
  user: {
    id: number;
    name: string;
  };
  status: string;
  payment_status: string;
  payment_method: string;
  payment_id: number | null;
  amounts: {
    currency: string;
    discount_amount: number;
    shipping_cost: number;
    sub_total: number;
    total_amount: number;
  };
  city: {
    id: number;
    name: string;
    city_code: string;
    is_active: boolean;
  };
  shipping: {
    courier_id: number;
    courier: {
      id: number;
      name: string;
      code: string;
      logo: string | null;
      tracking_url: string;
    };
    address: string;
    tracking_number: string | null;
  };
  items_count: number;
  notes: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem;
}


export interface MappedOrderViewModel {
  id: string | number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  cityName: string;
  courierName: string | null;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  subTotal: number;
  shippingCost: number;
  isShippingFree: boolean;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  trackingNumber: string | null;
  notes: string | null;
  cancelReason: string | null;
  items: OrderItem[];
  itemsCount: number;
}

export function mapOrderToViewModel(order: Order<string>): MappedOrderViewModel {

  const amounts = order?.amounts;
  const shipping = order?.shipping;
  const courier = order?.shipping?.courier;
  const customer = order?.customer;
  const cityName = order?.city?.name ?? "";
  const rawItems = order?.items || [];

  const items: OrderItem[] = rawItems.map((item: OrderItem) => ({
    id: item.id,
    product_variant_id: item.product_variant_id,
    name: item.name || `منتج رقم #${item.product_variant_id}`,
    quantity: item.quantity || 0,
    price: Number(item.price || 0),
    total: Number(item.total ?? (item.price * item.quantity || 0)),
    weight: item.weight ? Number(item.weight) : undefined,
    sku: item?.variant?.sku,
    size: item?.variant?.attributes?.size,
    color: item?.variant?.attributes?.color,
    image: item?.image || null,
  }));

  return {
    id: order?.id ?? "",
    orderNumber: order?.order_number ?? "",
    status: order?.status ?? "pending",
    paymentStatus: order.status ?? "unpaid",
    paymentMethod: order.payment.method ?? "online",
    shippingAddress: shipping?.address ?? "-",
    cityName: cityName ?? "",
    courierName: courier?.name ?? null,
    customerName: customer?.name ?? "-",
    customerEmail: customer?.email ?? null,
    customerPhone: customer?.phone_primary ?? "",
    subTotal: Number(amounts?.sub_total ?? 0),
    shippingCost: Number(amounts?.shipping_cost ?? 0),
    discountAmount: Number(amounts?.discount_amount ?? 0),
    isShippingFree: Boolean(amounts?.is_shipping_free ?? false),
    totalAmount: Number(amounts?.total_amount ?? 0),
    currency: amounts?.currency ?? "EGP",
    createdAt: order?.created_at ?? "",
    trackingNumber: shipping?.tracking_number ?? null,
    notes: order?.notes ?? null,
    cancelReason: order?.cancel_reason ?? null,
    items,
    itemsCount: order?.items_count ?? items.length,
  };
}