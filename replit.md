# PetTravel - Pet Travel Requirements Research Application

## Overview

PetTravel is a web application that helps pet owners research international travel requirements for dogs and cats. The application uses AI-powered research (via Perplexity API) to gather comprehensive, up-to-date information about government regulations, health requirements, documentation, quarantine rules, and airline policies for traveling between countries with pets.

The application provides a user-friendly interface where travelers can select their origin country, destination country, and pet type, then receive a detailed breakdown of all requirements organized by category.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) v5 for server state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite

**Design System:**
The application follows a hybrid design approach inspired by travel platforms (Airbnb, Booking.com) combined with information-dense patterns from government websites. Key principles include:
- Trust through clarity for regulatory information
- Progressive disclosure from simple selection to detailed requirements
- Mobile-first responsive design
- Custom typography using Inter (UI elements) and Source Sans Pro (body text)
- Consistent spacing primitives based on Tailwind units
- Custom color system with HSL values for light/dark mode support

**Component Structure:**
- `Hero`: Landing section with call-to-action
- `CountrySelector`: Form for selecting origin, destination, and pet type
- `RequirementsDisplay`: Accordion-based display of categorized requirements
- `HowItWorks`: Informational section explaining the service
- `TrustSection`: Building credibility through feature highlights
- `Footer`: Site footer with navigation

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **API Integration**: Perplexity AI API for research
- **Validation**: Zod schemas for request/response validation
- **Development**: Vite middleware for HMR in development

**API Design:**
Single main endpoint: `POST /api/pet-travel/requirements`
- Accepts: origin country, destination country, pet type
- Returns: Categorized requirements with descriptions and criticality flags
- Implements in-memory caching with 24-hour TTL

**AI Research Strategy:**
The application uses Perplexity's `llama-3.1-sonar-large-128k-online` model to:
1. Search official government sources, embassy websites, and veterinary boards
2. Extract and categorize requirements into health, documentation, quarantine, and airline categories
3. Identify critical requirements that must be completed
4. Provide specific, actionable information with proper context

### Data Storage

**Current Implementation:**
- In-memory caching using Map data structure
- Cache key format: `{origin}-{destination}-{petType}`
- TTL: 24 hours (86,400,000 milliseconds)
- No persistent database currently implemented

**Storage Interface:**
Abstract `IStorage` interface defined to allow future database integration:
- `cacheRequirements(key, data)`: Store requirements
- `getCachedRequirements(key)`: Retrieve cached requirements

**Database Configuration:**
While not currently in use, the application includes Drizzle ORM configuration for PostgreSQL:
- Schema definition location: `shared/schema.ts`
- Migrations output: `./migrations`
- Connection via `DATABASE_URL` environment variable
- Prepared for Neon Database serverless PostgreSQL integration

### External Dependencies

**Third-Party APIs:**
- **Perplexity AI API**: Real-time research of pet travel requirements
  - Model: `llama-3.1-sonar-large-128k-online`
  - Configuration: Temperature 0.2, Top-p 0.9
  - Authentication: Bearer token via `PERPLEXITY_API_KEY` environment variable
  - Used for searching government regulations and travel policies

**UI Component Libraries:**
- **Radix UI**: Unstyled, accessible component primitives (accordion, dialog, select, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI
- **Lucide React**: Icon library

**Development Tools:**
- **@replit/vite-plugin-runtime-error-modal**: Runtime error overlay in development
- **@replit/vite-plugin-cartographer**: Code navigation (Replit environment only)
- **@replit/vite-plugin-dev-banner**: Development banner (Replit environment only)

**Utilities:**
- **date-fns**: Date manipulation and formatting
- **clsx + tailwind-merge**: Conditional CSS class composition
- **class-variance-authority**: Type-safe variant styling
- **nanoid**: Unique ID generation

**Form Handling:**
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **Zod**: Runtime type validation and schema definition

**Database (Configured but not active):**
- **@neondatabase/serverless**: Neon Database PostgreSQL driver
- **Drizzle ORM**: Type-safe SQL query builder
- **drizzle-kit**: Database migrations and schema management
- **connect-pg-simple**: PostgreSQL session store (for future session management)

**Environment Variables Required:**
- `PERPLEXITY_API_KEY`: API key for Perplexity AI research
- `DATABASE_URL`: PostgreSQL connection string (optional, for future use)
- `NODE_ENV`: Environment setting (development/production)