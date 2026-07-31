// src/services/testEventService.ts

import axiosInstance from "@/api/axios-instance";



export const testEventService = {
  /**
   * Trigger the test order created event.
   */
  async triggerTestOrderEvent() {
    return await axiosInstance.get('/test-order-event');
  },
};