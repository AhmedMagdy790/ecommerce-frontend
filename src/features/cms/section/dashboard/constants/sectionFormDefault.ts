
import type { SectionFormInput } from "../../model/schema/sectionSchema";
import type { SectionItemFormInput } from "../../model/schema/sectionItemSchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const createDefaultSectionValues = (
  pageId: number,
): SectionFormInput => ({
  page_id: pageId,
  name: getEmptyTranslatedObject(),
  key: "",
  type: "hero",
  sort_order: 0,
  is_active: true,
  settings: {},
});

export const createDefaultSectionItemValues = (
  sectionId: number,
): SectionItemFormInput => ({
  section_id: sectionId,
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
});