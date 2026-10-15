import type { AxiosResponse } from "axios";

export function unwrap<T>(response: AxiosResponse<T>): T {
    return response.data;
}


export const appendToFormData = (
  formData: FormData,
  data: any,
  parentKey?: string
): void => {
  if (data === undefined || data === "") {
    return;
  }

  if (data === null) {
    formData.append(parentKey!, "null");
    return;
  }

  if (data instanceof File) {
    formData.append(parentKey!, data);
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      appendToFormData(formData, item, `${parentKey}[${index}]`);
    });
  } else if (typeof data === "object" && !(data instanceof Date)) {
    Object.entries(data).forEach(([key, value]) => {
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      appendToFormData(formData, value, formKey);
    });
  } else if (typeof data === "boolean") {
    formData.append(parentKey!, data ? "1" : "0");
  } else {
    formData.append(parentKey!, String(data));
  }
};


export const createFormData = (payload: object) => {
  const formData = new FormData();
  appendToFormData(formData, payload);

  return formData;
};