export interface Country {
  id: number;
  name: Record<string, string> | string;
  code?: string;
  is_active?: boolean;
}

export interface City {
  id: number;
  country_id: number;
  name: Record<string, string> | string;
  is_active?: boolean;
}