// src/shared/store/adapter.actions.ts
import type { PaginationMeta } from "../types/api.types";

export interface ApiAdapters<
  T, 
  TListResponse, 
  TCreateResponse, 
  TUpdateResponse, 
  TStats = unknown
> {
  fromListResponse(response: TListResponse): T[];
  fromCreateResponse(response: TCreateResponse): T;
  fromUpdateResponse(response: TUpdateResponse): T;
  extractPagination(response: TListResponse): PaginationMeta;
  
  // 💡 اجعلها اختيارية لكي لا تفرض إجبارها على الأقسام التي لا تحتوي على إحصائيات
  extractStats?(response: TListResponse): TStats;
}

export function createAdapterStore<
  T,
  TListResponse,
  TCreateResponse,
  TUpdateResponse,
  TStats = unknown
>(
  adapters: ApiAdapters<T, TListResponse, TCreateResponse, TUpdateResponse, TStats>
): () => ApiAdapters<T, TListResponse, TCreateResponse, TUpdateResponse, TStats> {
  return () => adapters;
}