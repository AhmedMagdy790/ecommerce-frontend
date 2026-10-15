export interface Media {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string | null;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string | null;
  disk: string;
  conversions_disk: string | null;
  size: number;
  manipulations: Record<string, any>;
  custom_properties: Record<string, any>;
  generated_conversions: Record<string, any>;
  responsive_images: Record<string, any>;
  order_column: number | null;
  

  url?: string;
  preview_url?: string;

  created_at: string;
  updated_at: string;
}

export interface MediaFormData {
  file: File;
  collection_name?: string;
  custom_properties?: Record<string, any>;
}