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

  const systemPrompt = `You are a pet travel requirements expert specializing in government regulations and official documentation. Provide accurate information based solely on official government sources, customs departments, and veterinary regulatory bodies. Do not include airline-specific policies.`;

  const userPrompt = `Research the official government requirements for traveling with a ${petType} from ${origin} to ${destination}.

Provide clear, organized information in these categories:

1. HEALTH & VACCINATION REQUIREMENTS
   - Required vaccinations (rabies, etc.) with specific timing
   - Health certificates and veterinary examinations required
   - Blood tests or antibody titers if needed
   - Required parasite treatments

2. DOCUMENTATION & PERMITS
   - Import permits and how to apply
   - Microchip requirements (ISO standards)
   - Official forms and certificates needed
   - Proof of ownership requirements

3. QUARANTINE & ENTRY REGULATIONS
   - Quarantine requirements and duration
   - Conditions for quarantine exemption
   - Approved entry points and customs procedures
   - Any additional entry restrictions

For each requirement, clearly state:
- What is required
- When it must be done (timing/validity)
- Mark as CRITICAL if failure means denied entry
- Any specific details about ${destination}'s regulations

Focus ONLY on official government sources: customs departments, agriculture ministries, veterinary authorities, and embassy guidelines. Do not include airline policies or carrier requirements.

Format your response with clear bullet points for easy parsing.`;

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
      category: "Quarantine & Entry Regulations",
      items: [],
    },
  ];

  const cleanedContent = cleanContent(content);

  const sections = cleanedContent.split(/\d+\.\s+(?:HEALTH|DOCUMENTATION|QUARANTINE)/i);
  
  if (sections.length > 1) {
    const healthSection = extractSection(cleanedContent, /HEALTH\s+&\s+VACCINATION/i, /DOCUMENTATION/i);
    const docSection = extractSection(cleanedContent, /DOCUMENTATION\s+&\s+PERMITS/i, /QUARANTINE/i);
    const quarantineSection = extractSection(cleanedContent, /QUARANTINE\s+&\s+ENTRY/i, /$|$/);

    categories[0].items = parseItems(healthSection);
    categories[1].items = parseItems(docSection);
    categories[2].items = parseItems(quarantineSection);
  } else {
    const lines = cleanedContent.split('\n');
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
      } else if (trimmed.match(/permit|microchip|documentation|ownership|form|certificate/i) && currentCategory <= 1) {
        if (currentItem.title && currentCategory === 0) {
          categories[0].items.push({ ...currentItem });
        }
        currentCategory = 1;
        currentItem = extractItemFromLine(trimmed);
      } else if (trimmed.match(/quarantine|entry|customs|border|port/i) && currentCategory <= 2) {
        if (currentItem.title && currentCategory === 1) {
          categories[1].items.push({ ...currentItem });
        }
        currentCategory = 2;
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

function cleanContent(content: string): string {
  return content
    .replace(/\[\d+\]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
    
    const fullText = lines.join(' ').trim();
    const isCritical = /critical|mandatory|required|must/i.test(fullText);
    
    const colonIndex = fullText.indexOf(':');
    if (colonIndex > 0 && colonIndex < 100) {
      const rawTitle = fullText.slice(0, colonIndex).trim();
      const rawDescription = fullText.slice(colonIndex + 1).trim();
      
      const title = cleanText(rawTitle);
      const description = cleanText(rawDescription);
      
      if (title && description && title.toLowerCase() !== description.toLowerCase() && description.length > 3) {
        items.push({ 
          title, 
          description, 
          critical: isCritical 
        });
      }
    } else if (fullText.length > 0) {
      const cleanedText = cleanText(fullText);
      const sentences = cleanedText.split(/\.\s+/).filter(s => s.trim());
      
      if (sentences.length >= 2) {
        const title = sentences[0].trim();
        const description = sentences.slice(1).join('. ').trim() + (sentences.slice(1).join('').includes('.') ? '' : '.');
        
        if (title && description && title.toLowerCase() !== description.toLowerCase()) {
          items.push({
            title,
            description,
            critical: isCritical,
          });
        }
      } else if (sentences.length === 1 && sentences[0].length > 10) {
        items.push({
          title: sentences[0],
          description: "See official sources for detailed information.",
          critical: isCritical,
        });
      }
    }
  }
  
  return items.filter(item => 
    item.title && 
    item.description && 
    item.title.toLowerCase() !== item.description.toLowerCase() &&
    !item.title.match(/^###?\s*\d+\.?$/)
  );
}

function cleanText(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/--+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
