import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { petTravelRequestSchema } from "@shared/schema";
import { researchPetTravelRequirements } from "./perplexity";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/pet-travel/requirements", async (req, res) => {
    try {
      const validatedRequest = petTravelRequestSchema.parse(req.body);
      
      const cacheKey = `${validatedRequest.origin}-${validatedRequest.destination}-${validatedRequest.petType}`;
      
      const cached = await storage.getCachedRequirements(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const requirements = await researchPetTravelRequirements(validatedRequest);
      
      await storage.cacheRequirements(cacheKey, requirements);
      
      res.json(requirements);
    } catch (error) {
      console.error("Error fetching pet travel requirements:", error);
      
      if (error instanceof Error && error.message.includes("Perplexity")) {
        return res.status(502).json({ 
          error: "Failed to research requirements. Please try again." 
        });
      }
      
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
