import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RequirementPhaseDisplay {
  phase: "entry" | "exit";
  country: string;
  icon: any;
  items: {
    title: string;
    description: string;
    critical?: boolean;
    subcategory?: "health" | "documentation" | "quarantine" | "general";
  }[];
}

interface RequirementsDisplayProps {
  origin: string;
  destination: string;
  petType: "dog" | "cat";
  requirements: RequirementPhaseDisplay[];
  isLoading?: boolean;
  onBack?: () => void;
}

export default function RequirementsDisplay({
  origin,
  destination,
  petType,
  requirements,
  isLoading = false,
  onBack,
}: RequirementsDisplayProps) {
  if (isLoading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Researching requirements from official sources...
          </p>
        </div>
      </div>
    );
  }

  const totalRequirements = requirements.reduce(
    (sum, req) => sum + req.items.length,
    0
  );

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
            data-testid="button-back"
          >
            ← Back to Search
          </Button>
        )}

        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {origin} → {destination}
              </h2>
              <p className="text-muted-foreground">
                Requirements for traveling with a {petType}
              </p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {totalRequirements} Requirements
            </Badge>
          </div>
        </Card>

        <div className="space-y-4">
          <Accordion type="multiple" defaultValue={["entry"]} className="space-y-4">
            {requirements.map((phaseReq) => {
              const phaseLabel = phaseReq.phase === "entry" 
                ? `Entry Requirements (${phaseReq.country})`
                : `Exit Requirements (${phaseReq.country})`;
              
              return (
                <AccordionItem
                  key={phaseReq.phase}
                  value={phaseReq.phase}
                  className="border rounded-lg px-6 bg-card"
                >
                  <AccordionTrigger
                    className="hover:no-underline py-6"
                    data-testid={`accordion-${phaseReq.phase}`}
                  >
                    <div className="flex items-center gap-3">
                      <phaseReq.icon className="h-6 w-6 text-primary" />
                      <span className="text-lg font-semibold">
                        {phaseLabel}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {phaseReq.items.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4 pt-2">
                      {phaseReq.items.map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-l-4 ${
                            item.critical
                              ? "bg-destructive/10 border-destructive"
                              : "bg-muted/50 border-primary"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {item.critical ? (
                              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{item.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <Card className="p-6 mt-6 bg-muted/50">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Start preparing at least 4-6 months
                before your travel date. Some vaccinations and permits require
                significant processing time.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
