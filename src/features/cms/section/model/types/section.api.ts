import type {
  PaginatedApiResponse,
  SuccessApiResponse,
} from "@/shared/types/api.types";

import type { Section } from "./section.types";
import type { TranslatedText } from "@/shared/types/types";

export type SectionListResponse =
  PaginatedApiResponse<Section<TranslatedText>>;

export type SectionSingleResponse =
  SuccessApiResponse<{
    section: Section<TranslatedText>;
  }>;

export type SectionDeleteResponse =
  SuccessApiResponse<null>;