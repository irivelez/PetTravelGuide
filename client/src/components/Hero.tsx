import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import heroImage from "@assets/generated_images/Traveler_with_dog_in_airplane_bec34355.png";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <PawPrint className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Travel Safely With Your Pet
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get comprehensive, up-to-date requirements for traveling with your dog or cat to any country
        </p>
        
        <Button
          size="lg"
          onClick={onGetStarted}
          className="px-8 py-6 text-lg font-semibold rounded-lg bg-primary/90 backdrop-blur-md hover:bg-primary border border-primary-border"
          data-testid="button-get-started"
        >
          Check Requirements Now
        </Button>
        
        <div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>190+ Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Official Sources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
