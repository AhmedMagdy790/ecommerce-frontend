// src/shared/types/media.ts

export interface Media {
  id: number | string;
  uuid?: string | null;
  collection_name?: string;
  name: string;
  file_name: string;
  mime_type?: string | null;
  size?: number;
  
  url: string;
  preview_url?: string;
  thumbnail_url?: string;

  custom_properties?: Record<string, any>;

  created_at?: string;
  updated_at?: string;
}

export interface MediaFormData {
  file: File | Blob;
  collection_name?: string;
  custom_properties?: Record<string, any>;
}