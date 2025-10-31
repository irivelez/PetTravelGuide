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
  subcategory: z.enum(["health", "documentation", "quarantine", "general"]).optional(),
});

export const requirementPhaseSchema = z.object({
  phase: z.enum(["entry", "exit"]),
  country: z.string(),
  items: z.array(requirementItemSchema),
});

export const petTravelResponseSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  petType: z.enum(["dog", "cat"]),
  requirements: z.array(requirementPhaseSchema),
  lastUpdated: z.string(),
});

export type RequirementItem = z.infer<typeof requirementItemSchema>;
export type RequirementPhase = z.infer<typeof requirementPhaseSchema>;
export type PetTravelResponse = z.infer<typeof petTravelResponseSchema>;
