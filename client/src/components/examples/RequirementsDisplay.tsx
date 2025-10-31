import RequirementsDisplay from '../RequirementsDisplay';
import {
  Syringe,
  FileText,
  Home,
  Plane,
} from "lucide-react";

const mockRequirements = [
  {
    id: "health",
    category: "Health & Vaccination Requirements",
    icon: Syringe,
    items: [
      {
        title: "Rabies Vaccination",
        description:
          "Your pet must be vaccinated against rabies at least 21 days before travel but not more than 12 months prior. The vaccine must be administered after microchip implantation.",
        critical: true,
      },
      {
        title: "Health Certificate",
        description:
          "A veterinary health certificate issued within 10 days of departure is required. Must be endorsed by USDA if traveling from the US.",
      },
    ],
  },
  {
    id: "documentation",
    category: "Documentation & Permits",
    icon: FileText,
    items: [
      {
        title: "Import Permit",
        description:
          "An import permit must be obtained from the destination country's agriculture department. Processing time is typically 4-6 weeks.",
        critical: true,
      },
      {
        title: "Microchip",
        description:
          "ISO 11784/11785 compliant 15-digit microchip is mandatory. Must be implanted before rabies vaccination.",
      },
    ],
  },
  {
    id: "quarantine",
    category: "Quarantine Regulations",
    icon: Home,
    items: [
      {
        title: "No Quarantine Required",
        description:
          "If all requirements are met, your pet can enter without quarantine. Failure to meet any requirement may result in quarantine or denial of entry.",
      },
    ],
  },
  {
    id: "airline",
    category: "Airline-Specific Rules",
    icon: Plane,
    items: [
      {
        title: "Carrier Requirements",
        description:
          "Pet carrier must be large enough for the animal to stand, turn around, and lie down. Maximum dimensions vary by airline.",
      },
      {
        title: "Advance Booking",
        description:
          "Most airlines require at least 48 hours notice for pet travel. Some limit the number of pets per flight.",
      },
    ],
  },
];

export default function RequirementsDisplayExample() {
  return (
    <RequirementsDisplay
      origin="United States"
      destination="United Kingdom"
      petType="dog"
      requirements={mockRequirements}
      onBack={() => console.log('Back clicked')}
    />
  );
}
