export interface ShippingOption {
  id: number;
  name: string | Record<string, string>;
  logo_url: string | null;
  supports_cod: boolean;
  shipping_details: {
    shipping_fee: number;
    estimated_delivery_from: number | null;
    estimated_delivery_to: number | null;
  };
}