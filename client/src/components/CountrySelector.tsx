import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Dog, Cat } from "lucide-react";

interface CountrySelectorProps {
  onSearch: (origin: string, destination: string, petType: "dog" | "cat") => void;
}

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Japan",
  "Australia",
  "New Zealand",
  "Mexico",
  "Brazil",
  "Argentina",
  "South Africa",
  "India",
  "China",
  "South Korea",
  "Thailand",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
];

export default function CountrySelector({ onSearch }: CountrySelectorProps) {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [petType, setPetType] = useState<"dog" | "cat">("dog");

  const handleSearch = () => {
    if (origin && destination) {
      onSearch(origin, destination, petType);
    }
  };

  const canSearch = origin && destination;

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Plan Your Journey
          </h2>
          <p className="text-muted-foreground">
            Select your travel route and pet type to get detailed requirements
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-base font-semibold">
                  From
                </Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger
                    id="origin"
                    className="h-12"
                    data-testid="select-origin"
                  >
                    <SelectValue placeholder="Select origin country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-base font-semibold">
                  To
                </Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger
                    id="destination"
                    className="h-12"
                    data-testid="select-destination"
                  >
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Pet Type</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={petType === "dog" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setPetType("dog")}
                  data-testid="button-pet-dog"
                >
                  <Dog className="h-5 w-5 mr-2" />
                  Dog
                </Button>
                <Button
                  type="button"
                  variant={petType === "cat" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setPetType("cat")}
                  data-testid="button-pet-cat"
                >
                  <Cat className="h-5 w-5 mr-2" />
                  Cat
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-12"
              onClick={handleSearch}
              disabled={!canSearch}
              data-testid="button-check-requirements"
            >
              Check Requirements
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
