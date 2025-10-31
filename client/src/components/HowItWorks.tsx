import { Card } from "@/components/ui/card";
import { Search, FileSearch, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Select Your Route",
    description:
      "Choose your departure and destination countries, plus whether you're traveling with a dog or cat.",
  },
  {
    number: "2",
    icon: FileSearch,
    title: "We Research",
    description:
      "Our AI searches government websites, airline policies, and veterinary boards for the latest requirements.",
  },
  {
    number: "3",
    icon: CheckCircle,
    title: "Get Your Checklist",
    description:
      "Receive a comprehensive, organized list of everything you need to travel safely with your pet.",
  },
];

export default function HowItWorks() {
  return (
    <div className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get reliable, up-to-date pet travel requirements in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="p-6 text-center hover-elevate transition-all duration-200"
            >
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-3">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
