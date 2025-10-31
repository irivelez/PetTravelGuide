import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import CountrySelector from "@/components/CountrySelector";
import RequirementsDisplay from "@/components/RequirementsDisplay";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import {
  Syringe,
  FileText,
  Home as HomeIcon,
  Plane,
} from "lucide-react";

export default function Home() {
  const [searchParams, setSearchParams] = useState<{
    origin: string;
    destination: string;
    petType: "dog" | "cat";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const selectorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    selectorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (origin: string, destination: string, petType: "dog" | "cat") => {
    setIsLoading(true);
    setSearchParams({ origin, destination, petType });
    
    setTimeout(() => {
      setIsLoading(false);
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  };

  const handleBack = () => {
    setSearchParams(null);
    selectorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const mockRequirements = [
    {
      id: "health",
      category: "Health & Vaccination Requirements",
      icon: Syringe,
      items: [
        {
          title: "Rabies Vaccination",
          description:
            `Your ${searchParams?.petType || 'pet'} must be vaccinated against rabies at least 21 days before travel but not more than 12 months prior. The vaccine must be administered after microchip implantation.`,
          critical: true,
        },
        {
          title: "Health Certificate",
          description:
            "A veterinary health certificate issued within 10 days of departure is required. Must be endorsed by USDA if traveling from the US.",
        },
        {
          title: "Parasite Treatment",
          description:
            "Treatment for tapeworm and ticks must be administered 24-120 hours before entry and documented in the health certificate.",
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
        {
          title: "Proof of Ownership",
          description:
            "Documentation proving you've owned the pet for at least 6 months, or adoption papers if recently acquired.",
        },
      ],
    },
    {
      id: "quarantine",
      category: "Quarantine Regulations",
      icon: HomeIcon,
      items: [
        {
          title: "No Quarantine Required",
          description:
            "If all requirements are met, your pet can enter without quarantine. Failure to meet any requirement may result in quarantine or denial of entry.",
        },
        {
          title: "Approved Entry Points",
          description:
            "Pets must enter through designated ports of entry with approved animal reception facilities.",
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
        {
          title: "Temperature Restrictions",
          description:
            "Many airlines have temperature restrictions and may not accept pets during extreme weather conditions.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={handleGetStarted} />
      
      <div ref={selectorRef}>
        <CountrySelector onSearch={handleSearch} />
      </div>
      
      {(searchParams || isLoading) && (
        <div ref={resultsRef}>
          <RequirementsDisplay
            origin={searchParams?.origin || ""}
            destination={searchParams?.destination || ""}
            petType={searchParams?.petType || "dog"}
            requirements={mockRequirements}
            isLoading={isLoading}
            onBack={handleBack}
          />
        </div>
      )}
      
      <HowItWorks />
      <TrustSection />
      <Footer />
    </div>
  );
}
