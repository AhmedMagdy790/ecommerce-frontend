export interface Setting {
  id: number;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettingFormData {
  key: string;
  value?: string | null;
}

export interface SettingFilters {
  search?: string;
  key?: string;
  [key: string]: any;
}