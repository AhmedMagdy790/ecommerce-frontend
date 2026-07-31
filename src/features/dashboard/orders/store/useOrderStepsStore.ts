import { create } from 'zustand';
import { type OrderFormData } from '../schema/orderSchema';

interface OrderState {
    currentStep: number;
    formData: Partial<OrderFormData>;
    setStep: (step: number) => void;
    updateFormData: (data: Partial<OrderFormData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetOrderForm: () => void;
}

export const useOrderSetpsStore = create<OrderState>((set) => ({
    currentStep: 0,
    formData: {},
    setStep: (step) => set({ currentStep: step }),
    updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    resetOrderForm: () => set({ currentStep: 0, formData: {} }),
}));