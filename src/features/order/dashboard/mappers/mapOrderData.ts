import type { Order } from "@/features/order/model/types/order.types";
import type { PaymentAttempt } from "@/features/payment/model/types/payment.types";

// دالة لتعيين طلب واحد
export const mapOrderData = (rawApiData: any): Order<string> => {
    if (!rawApiData) return {} as Order<string>;


    return {
        id: rawApiData.id,
        user_id: rawApiData.user_id ?? null,
        coupon_id: rawApiData.coupon_id ?? null,
        order_number: rawApiData.order_number ?? "",
        idempotency_key: "",

        amounts: {
            sub_total: rawApiData.amounts?.sub_total ?? "0",
            shipping_cost: rawApiData.amounts?.shipping_cost ?? "0",
            discount_amount: rawApiData.amounts?.discount_amount ?? "0",
            total_amount: rawApiData.amounts?.total_amount ?? "0",
            currency: rawApiData.amounts?.currency ?? "EGP",
        },

        payment: {
            status: rawApiData.payment?.status ?? "unpaid",
            method: rawApiData.payment?.method ?? rawApiData.payment_method ?? "online",

            attempts: (rawApiData.payment?.attempts || []).map((attempt: PaymentAttempt) => ({
                id: attempt.id,
                payment_gateway_id: attempt.payment_gateway_id,
                gateway: attempt.gateway,
                amount: attempt.amount,
                currency: attempt.currency,
                status: attempt.status,
                failure_reason: attempt.failure_reason,
                created_at: attempt.created_at,
            })),
        },

        customer: rawApiData.customer ?? null,
        shipping: rawApiData.shipping ?? null,
        city: rawApiData.city ?? undefined,
        items: rawApiData.items ?? [],
        items_count: rawApiData.items_count ?? 0,

        notes: rawApiData.notes ?? null,
        cancel_reason: rawApiData.cancel_reason ?? null,
        status: rawApiData.status ?? "pending",
        created_at: rawApiData.created_at ?? "",
        updated_at: rawApiData.updated_at ?? "",
    };
};

export const mapOrdersList = (rawList: any[]): Order<string>[] => {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(order => mapOrderData(order));
};