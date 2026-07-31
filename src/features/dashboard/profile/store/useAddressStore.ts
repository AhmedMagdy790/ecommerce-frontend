import { create } from 'zustand';
import addressService from '@/features/dashboard/profile/services/addressService';
import { toast } from 'react-hot-toast';
import type { IAddress, IAddressPayload } from '../types/profileTypes';

interface AddressState {
  addresses: IAddress[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAddresses: () => Promise<void>;
  createAddAddress: (payload: IAddressPayload) => Promise<boolean>;
  updateAddress: (id: number, payload: Partial<IAddressPayload>) => Promise<boolean>;
  removeAddress: (id: number) => Promise<void>;
  makeDefault: (id: number) => Promise<void>;
}


export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await addressService.getAll();
      console.log(data)
      set({ addresses: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createAddAddress: async (payload) => {
    set({ isLoading: true });
    try {
      const newAddress = await addressService.create(payload);
 
      const currentAddresses = get().addresses;
      const updatedAddresses = payload.is_default 
        ? currentAddresses.map(addr => ({ ...addr, is_default: false })).concat(newAddress)
        : [...currentAddresses, newAddress];

      set({ addresses: updatedAddresses, isLoading: false });
      toast.success('Address added successfully');
      return true;
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Failed to add address');
      return false;
    }
  },

  updateAddress: async (id, payload) => {

    set({ isLoading: true });
    try {
      const updated = await addressService.update(id, payload);
      set((state) => ({
        addresses: state.addresses.map((addr) => (addr.id === id ? updated : addr)),
        isLoading: false,
      }));
      return true;
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Update failed');
      return false;
    }
  },

  removeAddress: async (id) => {

    const previousAddresses = get().addresses;
    set((state) => ({
      addresses: state.addresses.filter((addr) => addr.id !== id),
    }));

    try {
      await addressService.remove(id);
    } catch (err: any) {
    
      set({ addresses: previousAddresses });
    }
  },

  makeDefault: async (id) => {
    try {
      await addressService.setDefault(id);
      set((state) => ({
        addresses: state.addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === id,
        })),
      }));
    } catch (err: any) {
    }
  },
}));