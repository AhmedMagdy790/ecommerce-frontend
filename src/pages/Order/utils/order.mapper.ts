import type { Order, OrderItem, OrderStatus } from "@/features/order/model/types/order.types";

export interface MappedOrderItem {
  id: number;
  productVariantId: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  weight?: number;
  image?: string | null;
}

export interface MappedOrderViewModel {
  id: string | number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  cityName: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  subTotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  trackingNumber: string | null;
  notes: string | null;
  items: MappedOrderItem[];
  itemsCount: number;
}

export function mapOrderToViewModel(order: Order<string>): MappedOrderViewModel {
  console.log("order map view", order)
  const amounts = order?.amounts;
  const shipping = order?.shipping;
  const customer = order?.customer;
  const rawItems = order?.items || [];

  const items: MappedOrderItem[] = rawItems.map((item: OrderItem) => ({
    id: item.id,
    productVariantId: item.product_variant_id,
    name: item.name || `منتج رقم #${item.product_variant_id}`,
    quantity: item.quantity,
    price: item.price,
    total: item.total ?? (item.price * item.quantity),
    weight: item.weight,
    image: item?.image || null,
  }));

  return {
    id: order?.id,
    orderNumber: order?.order_number ?? String(order?.id ?? ""),
    status: order?.status ?? "pending",
    paymentStatus: order?.payment_status ?? "unpaid",
    paymentMethod: order?.payment_method ?? "Online",
    shippingAddress: shipping?.address ?? "-",
    cityName:  order?.city?.name ?? "",
    customerName: customer?.name || "-",
    customerEmail: customer?.email || null,
    customerPhone: customer?.phone_primary || "",
    subTotal: amounts?.sub_total ?? order?.sub_total ?? 0,
    shippingCost: amounts?.shipping_cost ?? order?.shipping_cost ?? 0,
    discountAmount: amounts?.discount_amount ?? order?.discount_amount ?? 0,
    totalAmount: amounts?.total_amount ?? order?.total_amount ?? 0,
    currency: amounts?.currency ?? "EGP",
    createdAt: order?.created_at || "",
    trackingNumber: shipping?.tracking_number || null,
    notes: order?.notes || null,
    items,
    itemsCount: order?.items_count ?? items.length,
  };
}