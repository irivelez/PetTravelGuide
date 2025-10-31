import type { PetTravelRequest, PetTravelResponse, RequirementPhase } from "@shared/schema";

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

Organize your response into TWO main sections:

## ENTRY REQUIREMENTS (${destination})
Requirements imposed by ${destination} for entering the country with a pet:
- Health & Vaccination Requirements (rabies, health certificates, blood tests, parasite treatments)
- Documentation & Permits (import permits, microchip, official forms)
- Quarantine & Entry Regulations (quarantine rules, approved entry points, customs procedures)

## EXIT REQUIREMENTS (${origin})
Requirements imposed by ${origin} for leaving the country with a pet:
- Export permits or certificates needed
- Health documentation required by ${origin} for exit
- Any restrictions on taking pets out of ${origin}
- Timing requirements for exit documentation

For each requirement, clearly state:
- What is required
- When it must be done (timing/validity)
- Mark as CRITICAL if failure means denied entry/exit
- Which country imposes this requirement

IMPORTANT: Format your response with clear section headers "ENTRY REQUIREMENTS" and "EXIT REQUIREMENTS" followed by bullet points. If a country has no exit requirements, state "No specific exit requirements" in that section.

Focus ONLY on official government sources. Do not include airline policies.`;

  const result = await callPerplexity([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  const requirements = parseRequirementsFromResponse(result.content, origin, destination);

  return {
    origin,
    destination,
    petType,
    requirements,
    lastUpdated: new Date().toISOString(),
  };
}

function parseRequirementsFromResponse(content: string, origin: string, destination: string): RequirementPhase[] {
  const cleanedContent = cleanContent(content);
  
  const entrySection = extractSection(cleanedContent, /##\s*ENTRY\s+REQUIREMENTS/i, /##\s*EXIT\s+REQUIREMENTS/i);
  const exitSection = extractSection(cleanedContent, /##\s*EXIT\s+REQUIREMENTS/i, /$/);
  
  const phases: RequirementPhase[] = [];
  
  const entryItems = parsePhaseItems(entrySection, "entry");
  if (entryItems.length > 0) {
    phases.push({
      phase: "entry",
      country: destination,
      items: entryItems,
    });
  } else {
    phases.push({
      phase: "entry",
      country: destination,
      items: [{
        title: "Information Pending",
        description: "Entry requirements for this destination are being researched. Please consult official sources or contact the embassy.",
        critical: false,
      }],
    });
  }
  
  const exitItems = parsePhaseItems(exitSection, "exit");
  if (exitItems.length > 0) {
    phases.push({
      phase: "exit",
      country: origin,
      items: exitItems,
    });
  } else {
    phases.push({
      phase: "exit",
      country: origin,
      items: [{
        title: "No Exit Requirements",
        description: "No specific exit requirements found for this origin country. Standard travel documentation may apply.",
        critical: false,
      }],
    });
  }
  
  return phases;
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

function parsePhaseItems(section: string, phase: "entry" | "exit"): Array<{ title: string; description: string; critical?: boolean; subcategory?: "health" | "documentation" | "quarantine" | "general" }> {
  const items: Array<{ title: string; description: string; critical?: boolean; subcategory?: "health" | "documentation" | "quarantine" | "general" }> = [];
  
  const bulletPoints = section.split(/[-•*]\s+/).filter(s => s.trim());
  
  for (const point of bulletPoints) {
    const lines = point.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    const fullText = lines.join(' ').trim();
    const isCritical = /critical|mandatory|required|must/i.test(fullText);
    
    let subcategory: "health" | "documentation" | "quarantine" | "general" = "general";
    if (fullText.match(/vaccination|rabies|health certificate|blood test|parasite|veterinary/i)) {
      subcategory = "health";
    } else if (fullText.match(/permit|microchip|documentation|certificate|form|passport/i)) {
      subcategory = "documentation";
    } else if (fullText.match(/quarantine|entry point|customs|border|inspection/i)) {
      subcategory = "quarantine";
    }
    
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
          critical: isCritical,
          subcategory,
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
            subcategory,
          });
        }
      } else if (sentences.length === 1 && sentences[0].length > 10) {
        items.push({
          title: sentences[0],
          description: "See official sources for detailed information.",
          critical: isCritical,
          subcategory,
        });
      }
    }
  }
  
  return items.filter(item => 
    item.title && 
    item.description && 
    item.title.toLowerCase() !== item.description.toLowerCase() &&
    !item.title.match(/^###?\s*\d+\.?$/) &&
    !item.title.match(/no\s+(specific|exit)\s+requirements/i)
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
