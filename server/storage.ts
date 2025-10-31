import type { PetTravelResponse } from "@shared/schema";

export interface IStorage {
  cacheRequirements(key: string, data: PetTravelResponse): Promise<void>;
  getCachedRequirements(key: string): Promise<PetTravelResponse | undefined>;
}

export class MemStorage implements IStorage {
  private cache: Map<string, { data: PetTravelResponse; timestamp: number }>;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000;

  constructor() {
    this.cache = new Map();
  }

  async cacheRequirements(key: string, data: PetTravelResponse): Promise<void> {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getCachedRequirements(key: string): Promise<PetTravelResponse | undefined> {
    const cached = this.cache.get(key);
    if (!cached) return undefined;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }
}

export const storage = new MemStorage();
