type CacheParams = Record<string, unknown>;

export const createCacheKey = (
  prefix: string,
  params?: CacheParams
): string => {
  const normalizedParams = {
    ...params,
    page: params?.page ?? 1,
  };

  return `${prefix}:${JSON.stringify(normalizedParams)}`;
};