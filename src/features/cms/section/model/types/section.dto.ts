import z from "zod";
import type { sectionSchema } from "../schema/sectionSchema";

export type CreateSectionDto = z.infer<typeof sectionSchema>;

export type UpdateSectionDto = Partial<CreateSectionDto>;