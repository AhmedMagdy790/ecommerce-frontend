// src/features/address/store/address.actions.ts

import { createCustomActions } from "@/shared/store/createCustomActions";
import type { CombinedFeatureState } from "@/shared/store/createFeatureStore";

import addressServices from "../../api/address.service";

import type { Address, AddressFilters } from "../types/address.types";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "../types/address.dto";

/* =========================================================
 * Custom Actions
 * =======================================================*/

export interface AddressCustomActions {
  isSettingDefault: boolean;
  setDefaultError: string | null;
  settingDefaultId: number | string | null;

  setDefaultAddress(id: number | string): Promise<void>;
}

/* =========================================================
 * Feature State
 * =======================================================*/

export type AddressFeatureState =
  CombinedFeatureState<
    Address,
    CreateAddressDto,
    UpdateAddressDto,
    AddressFilters
  > &
  AddressCustomActions;

/* =========================================================
 * Actions
 * =======================================================*/

export const createAddressActions = createCustomActions<
  AddressFeatureState,
  AddressCustomActions
>(({ set, get }) => ({
  /* =======================================================
   * State
   * =====================================================*/

  isSettingDefault: false,

  setDefaultError: null,

  settingDefaultId: null,

  /* =======================================================
   * Set Default Address
   * =====================================================*/

  async setDefaultAddress(id) {
    const state = get();

    const previousItems = state.items.map((item) => ({
      ...item,
    }));

    const targetIndex = state.items.findIndex(
      (item) => item.id === id,
    );

    if (targetIndex === -1) {
      set((state) => {
        state.setDefaultError = "Address not found";
      });

      return;
    }

    const targetAddress = state.items[targetIndex];

    if (targetAddress.is_default) {
      return;
    }

    /* =====================================================
     * Loading
     * ===================================================*/

    set((state) => {
      state.isSettingDefault = true;
      state.settingDefaultId = id;
      state.setDefaultError = null;

      state.items.forEach((item) => {
        item.is_default = item.id === id;
      });
    });

    try {
      /* ===================================================
       * API
       * =================================================*/

      const response = await addressServices.setDefault(id);

      /* ===================================================
       * Response
       * =================================================*/

      const updatedAddress = response.data?.address;

      set((state) => {
        state.isSettingDefault = false;
        state.settingDefaultId = null;

        if (updatedAddress) {
          const index = state.items.findIndex(
            (item) => item.id === updatedAddress.id,
          );

          if (index !== -1) {
            state.items[index] = {
              ...state.items[index],
              ...updatedAddress,
            };
          }
        }
      });
    } catch (error) {
      /* ===================================================
       * Rollback
       * =================================================*/

      set((state) => {
        state.items = previousItems;

        state.isSettingDefault = false;
        state.settingDefaultId = null;

        state.setDefaultError =
          error instanceof Error
            ? error.message
            : "Failed to set default address";
      });
    }
  },
}));