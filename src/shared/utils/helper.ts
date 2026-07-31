export const unwrapResponse = <T>(response: any): {
  data: T;
  status: string;
  message: string;
} => {

  const payload = response.data?.data
    ? response.data
    : response;

  return {
    data: payload.data as T,
    status: payload.status,
    message: payload.message,
  };
};

export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}