import { PawPrint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-12 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">PetTravel</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making pet travel safer and easier by providing accurate,
              up-to-date travel requirements from official sources worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Popular Routes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  USA to UK
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  USA to France
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Canada to Australia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  UK to Spain
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Travel Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Health Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Airline Policies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 PetTravel. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
