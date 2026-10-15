import type { AddressFormInput } from "../model/schema/addressSchema";

export const defaultAddressValues: AddressFormInput = {
    country_id: "" as unknown as number, // أو 0 حسب الـ schema لديك
    city_id: "" as unknown as number,
    type: "shipping",
    street_details: "",
    area: "",
    building_number: "",
    phone_contact: "",
    is_default: false,
};