
export interface IUpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: File | null;
}



export interface IAddressPayload {
  type: "home" | "work" | "other",
  country_id: string,
  city_id: string,
  area_ar: string,
  area_en: string,
  street_details: string,
  building_number: string,
  phone_contact: string,
  is_default: boolean,
}

export interface IAddress {
  type: "home" | "work" | "other",
  country: {
    name:  {
      ar: string;
      en: string
    }
  },
  city: {
    name: {
      ar: string;
      en: string
    }
  },
  area_ar: string,
  area_en: string,
  street_details: string,
  building_number: string,
  phone_contact: string,
  is_default: boolean,
}


export interface IUpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}