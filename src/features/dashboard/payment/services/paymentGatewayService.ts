import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type IPaymentGateway, type IPaymentGatewayPayload } from "../types/types";

const { paymentGateways: adminGateways } = API_ENDPOINTS.admin;
const publicGateways = API_ENDPOINTS.paymentGateways; // تأكد من إضافته للـ Endpoints

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;

/** وظيفة مساعدة لتحويل الـ Object إلى FormData */
const appendToFormData = (formData: FormData, data: any, parentKey?: string) => {
    if (data instanceof File) {
        formData.append(parentKey!, data);
    } else if (Array.isArray(data)) {
        data.forEach((item, index) => {
            appendToFormData(formData, item, `${parentKey}[${index}]`);
        });
    } else if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
            appendToFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key);
        });
    } else if (data !== null && data !== undefined) {
        formData.append(parentKey!, data);
    }
};

const paymentGatewayService = {

    // --- 🛡️ Admin (لوحة التحكم) ---
    getAllAdmin: async (filters: any): Promise<any> => {
        const { data } = await axiosInstance.get(adminGateways.list, { params: filters });
        return data.data || data;
    },

    create: async (payload: IPaymentGatewayPayload): Promise<IPaymentGateway> => {
        const formData = new FormData();
        appendToFormData(formData, payload);

        const { data } = await axiosInstance.post(adminGateways.store, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data.data || data;
    },

    getById: async (id: number | string): Promise<IPaymentGateway> => {
        const { data } = await axiosInstance.get(adminGateways.edit(id));

        return data.data;
    },

    update: async (id: number | string, payload: Partial<IPaymentGatewayPayload>): Promise<IPaymentGateway> => {
        const formData = new FormData();
        appendToFormData(formData, payload);

        // استخدام _method PUT لمحاكاة الـ PUT عبر POST عند وجود FormData
        const { data } = await axiosInstance.post(adminGateways.update(id), formData, {
            headers: { "Content-Type": "multipart/form-data" },
            params: { _method: "PUT" },
        });
        return data.data || data;
    },

    toggleStatus: async (id: number | string): Promise<IPaymentGateway> => {
        return unwrap(await axiosInstance.patch(adminGateways.toggleStatus(id)));
    },

    toggleTestMode: async (id: number | string): Promise<IPaymentGateway> => {
        return unwrap(await axiosInstance.patch(adminGateways.toggleTestMode(id)));
    },

    remove: async (id: number | string): Promise<void> => {
        await axiosInstance.delete(adminGateways.destroy(id));
    }
};

export default paymentGatewayService;