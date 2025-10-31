import { z } from "zod";

export const petTravelRequestSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  petType: z.enum(["dog", "cat"]),
});

export type PetTravelRequest = z.infer<typeof petTravelRequestSchema>;

export const requirementItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  critical: z.boolean().optional(),
});

export const requirementCategorySchema = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(requirementItemSchema),
});

export const petTravelResponseSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  petType: z.enum(["dog", "cat"]),
  requirements: z.array(requirementCategorySchema),
  lastUpdated: z.string(),
});

export type RequirementItem = z.infer<typeof requirementItemSchema>;
export type RequirementCategory = z.infer<typeof requirementCategorySchema>;
export type PetTravelResponse = z.infer<typeof petTravelResponseSchema>;
