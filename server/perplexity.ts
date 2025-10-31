import type { PetTravelRequest, PetTravelResponse, RequirementCategory } from "@shared/schema";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  citations?: string[];
}

async function callPerplexity(messages: PerplexityMessage[]): Promise<{ content: string; citations: string[] }> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("PERPLEXITY_API_KEY environment variable is not set");
  }

  console.log("Calling Perplexity API...");
  
  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages,
      temperature: 0.2,
      top_p: 0.9,
      return_related_questions: false,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Perplexity API error: ${response.status}`, error);
    throw new Error(`Perplexity API error: ${response.status} ${error}`);
  }

  const data: PerplexityResponse = await response.json();
  console.log("Perplexity API response received successfully");
  
  return {
    content: data.choices[0].message.content,
    citations: data.citations || [],
  };
}

export async function researchPetTravelRequirements(
  request: PetTravelRequest
): Promise<PetTravelResponse> {
  const { origin, destination, petType } = request;

  const systemPrompt = `You are a pet travel requirements expert. You must provide accurate, detailed information about traveling internationally with pets based on official government regulations, airline policies, and veterinary requirements. Always cite official sources.`;

  const userPrompt = `I need comprehensive requirements for traveling with a ${petType} from ${origin} to ${destination}.

Please research and provide detailed information in the following categories:

1. HEALTH & VACCINATION REQUIREMENTS
   - Required vaccinations (rabies, etc.) with timing requirements
   - Health certificates and veterinary examinations
   - Blood tests or titers if required
   - Parasite treatments

2. DOCUMENTATION & PERMITS
   - Import permits and applications
   - Microchip requirements and standards
   - Proof of ownership documentation
   - Any country-specific forms

3. QUARANTINE REGULATIONS
   - Whether quarantine is required and duration
   - Conditions for quarantine exemption
   - Approved entry points

4. AIRLINE-SPECIFIC RULES
   - Carrier requirements and dimensions
   - Advance booking requirements
   - Temperature restrictions
   - Cabin vs cargo policies for this route

For each requirement, specify:
- The exact requirement
- Timing (how far in advance, validity period)
- Whether it's CRITICAL (failure results in denied entry) or standard
- Any specific details about the destination country's regulations

Focus on official government sources like USDA, DEFRA, EU regulations, and the destination country's agriculture/customs department.`;

  const result = await callPerplexity([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  const requirements = parseRequirementsFromResponse(result.content);

  return {
    origin,
    destination,
    petType,
    requirements,
    lastUpdated: new Date().toISOString(),
  };
}

function parseRequirementsFromResponse(content: string): RequirementCategory[] {
  const categories: RequirementCategory[] = [
    {
      id: "health",
      category: "Health & Vaccination Requirements",
      items: [],
    },
    {
      id: "documentation",
      category: "Documentation & Permits",
      items: [],
    },
    {
      id: "quarantine",
      category: "Quarantine Regulations",
      items: [],
    },
    {
      id: "airline",
      category: "Airline-Specific Rules",
      items: [],
    },
  ];

  const sections = content.split(/\d+\.\s+(?:HEALTH|DOCUMENTATION|QUARANTINE|AIRLINE)/i);
  
  if (sections.length > 1) {
    const healthSection = extractSection(content, /HEALTH\s+&\s+VACCINATION/i, /DOCUMENTATION/i);
    const docSection = extractSection(content, /DOCUMENTATION\s+&\s+PERMITS/i, /QUARANTINE/i);
    const quarantineSection = extractSection(content, /QUARANTINE/i, /AIRLINE/i);
    const airlineSection = extractSection(content, /AIRLINE/i, /$|$/);

    categories[0].items = parseItems(healthSection);
    categories[1].items = parseItems(docSection);
    categories[2].items = parseItems(quarantineSection);
    categories[3].items = parseItems(airlineSection);
  } else {
    const lines = content.split('\n');
    let currentCategory = 0;
    let currentItem = { title: '', description: '', critical: false };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.match(/vaccination|rabies|health certificate|blood test|parasite/i) && currentCategory === 0) {
        if (currentItem.title) {
          categories[0].items.push({ ...currentItem });
        }
        currentItem = extractItemFromLine(trimmed);
      } else if (trimmed.match(/permit|microchip|documentation|ownership|form/i) && currentCategory <= 1) {
        if (currentItem.title && currentCategory === 0) {
          categories[0].items.push({ ...currentItem });
        }
        currentCategory = 1;
        currentItem = extractItemFromLine(trimmed);
      } else if (trimmed.match(/quarantine/i) && currentCategory <= 2) {
        if (currentItem.title && currentCategory === 1) {
          categories[1].items.push({ ...currentItem });
        }
        currentCategory = 2;
        currentItem = extractItemFromLine(trimmed);
      } else if (trimmed.match(/airline|carrier|booking|cabin|cargo/i) && currentCategory <= 3) {
        if (currentItem.title && currentCategory === 2) {
          categories[2].items.push({ ...currentItem });
        }
        currentCategory = 3;
        currentItem = extractItemFromLine(trimmed);
      } else if (currentItem.title) {
        currentItem.description += ' ' + trimmed;
      }
    }

    if (currentItem.title) {
      categories[currentCategory].items.push(currentItem);
    }
  }

  categories.forEach(cat => {
    if (cat.items.length === 0) {
      cat.items.push({
        title: "Information Pending",
        description: "Specific requirements for this category are being researched. Please consult official sources or contact the embassy for detailed information.",
        critical: false,
      });
    }
  });

  return categories;
}

function extractSection(content: string, startPattern: RegExp, endPattern: RegExp): string {
  const startMatch = content.match(startPattern);
  if (!startMatch) return '';
  
  const startIndex = startMatch.index! + startMatch[0].length;
  const remaining = content.slice(startIndex);
  
  const endMatch = remaining.match(endPattern);
  const endIndex = endMatch ? endMatch.index! : remaining.length;
  
  return remaining.slice(0, endIndex);
}

function parseItems(section: string): Array<{ title: string; description: string; critical?: boolean }> {
  const items: Array<{ title: string; description: string; critical?: boolean }> = [];
  
  const bulletPoints = section.split(/[-•*]\s+/).filter(s => s.trim());
  
  for (const point of bulletPoints) {
    const lines = point.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    const firstLine = lines[0].trim();
    const isCritical = /critical|mandatory|required|must/i.test(point);
    
    const colonIndex = firstLine.indexOf(':');
    if (colonIndex > 0) {
      const title = firstLine.slice(0, colonIndex).trim();
      const descParts = [firstLine.slice(colonIndex + 1).trim(), ...lines.slice(1)];
      const description = descParts.join(' ').trim();
      
      if (title && description) {
        items.push({ title, description, critical: isCritical });
      }
    } else {
      items.push({
        title: firstLine,
        description: lines.slice(1).join(' ').trim() || firstLine,
        critical: isCritical,
      });
    }
  }
  
  return items;
}

function extractItemFromLine(line: string): { title: string; description: string; critical: boolean } {
  const isCritical = /critical|mandatory|required|must/i.test(line);
  const colonIndex = line.indexOf(':');
  
  if (colonIndex > 0) {
    return {
      title: line.slice(0, colonIndex).trim().replace(/^[-•*]\s*/, ''),
      description: line.slice(colonIndex + 1).trim(),
      critical: isCritical,
    };
  }
  
  return {
    title: line.replace(/^[-•*]\s*/, ''),
    description: '',
    critical: isCritical,
  };
}
