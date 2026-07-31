import { storeApi } from "@/api/client";
import type { HomePageResponse } from "../types";

export const cmsService = {
  async getPage(slug: string): Promise<HomePageResponse> {
    const response = await storeApi.getPageBySlug<HomePageResponse>(slug);

    return response?.data;
  },
};