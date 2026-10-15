import type { SectionFormData } from "../../model/schema/sectionSchema";
import type { SectionItemFormData } from "../../model/schema/sectionItemSchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";


export const defaultSectionValues: SectionFormData = {
  page_id: 0,
  name: getEmptyTranslatedObject(),
  key: "",
  type: "hero",
  sort_order: 0,
  is_active: true,
  settings: {},
};




export const defaultSectionItemValues: SectionItemFormData = {
  section_id: 0,
  product_id: null,
  title: getEmptyTranslatedObject(),
  subtitle: getEmptyTranslatedObject(),
  description: getEmptyTranslatedObject(),
  image: "",
  link: "",
  button_text: getEmptyTranslatedObject(),
  action_text: getEmptyTranslatedObject(),
  float_title: getEmptyTranslatedObject(),
  float_subtitle: getEmptyTranslatedObject(),
  stat_number: getEmptyTranslatedObject(),
  stat_text: getEmptyTranslatedObject(),
  data: null,
  sort_order: 0,
};