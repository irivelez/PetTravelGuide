import { Card } from "@/components/ui/card";
import { Shield, RefreshCw, Globe } from "lucide-react";

const trustPoints = [
  {
    icon: Globe,
    title: "Official Sources",
    description:
      "We research government agriculture departments, embassy websites, and official veterinary boards to ensure accuracy.",
  },
  {
    icon: RefreshCw,
    title: "Real-Time Verification",
    description:
      "Requirements are researched fresh for each query, ensuring you get the most current information available.",
  },
  {
    icon: Shield,
    title: "Comprehensive Coverage",
    description:
      "We check health requirements, documentation, quarantine rules, and airline policies for a complete picture.",
  },
];

export default function TrustSection() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Why Trust Our Research
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We use advanced AI to gather the most accurate and current pet travel requirements
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {trustPoints.map((point, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col items-start">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <point.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Sources we check:</strong>{" "}
              USDA APHIS, UK DEFRA, EU Pet Travel Scheme, individual country
              agriculture departments, IATA regulations, and major airline pet
              policies
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
