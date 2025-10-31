import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Hero from "@/components/Hero";
import CountrySelector from "@/components/CountrySelector";
import RequirementsDisplay from "@/components/RequirementsDisplay";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import type { PetTravelResponse } from "@shared/schema";
import {
  Syringe,
  FileText,
  Home as HomeIcon,
  Plane,
} from "lucide-react";

const categoryIcons = {
  health: Syringe,
  documentation: FileText,
  quarantine: HomeIcon,
  airline: Plane,
};

export default function Home() {
  const [requirementsData, setRequirementsData] = useState<PetTravelResponse | null>(null);
  const { toast } = useToast();
  
  const selectorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchMutation = useMutation({
    mutationFn: async (params: { origin: string; destination: string; petType: "dog" | "cat" }) => {
      const response = await apiRequest("POST", "/api/pet-travel/requirements", params);
      const data: PetTravelResponse = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setRequirementsData(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch requirements. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetStarted = () => {
    selectorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (origin: string, destination: string, petType: "dog" | "cat") => {
    searchMutation.mutate({ origin, destination, petType });
  };

  const handleBack = () => {
    setRequirementsData(null);
    selectorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const requirementsWithIcons = requirementsData?.requirements.map(req => ({
    ...req,
    icon: categoryIcons[req.id as keyof typeof categoryIcons] || FileText,
  })) || [];

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={handleGetStarted} />
      
      <div ref={selectorRef}>
        <CountrySelector onSearch={handleSearch} />
      </div>
      
      {(requirementsData || searchMutation.isPending) && (
        <div ref={resultsRef}>
          <RequirementsDisplay
            origin={requirementsData?.origin || ""}
            destination={requirementsData?.destination || ""}
            petType={requirementsData?.petType || "dog"}
            requirements={requirementsWithIcons}
            isLoading={searchMutation.isPending}
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
