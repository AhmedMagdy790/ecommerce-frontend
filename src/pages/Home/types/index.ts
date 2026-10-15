import type { Page } from "@/features/cms/page/model/types/page.types";


export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface HomePageData {
  page: Page<string>;
}

export type HomePageResponse = ApiResponse<HomePageData>;