# PetTravel - International Pet Travel Requirements Research

A web application that helps pet owners research international travel requirements for dogs and cats using AI-powered research through the Perplexity API.

## Features

- **AI-Powered Research**: Uses Perplexity AI to search official government sources for accurate, up-to-date pet travel requirements
- **Comprehensive Requirements**: Organizes requirements into entry and exit phases
  - **Entry Requirements**: What the destination country requires
  - **Exit Requirements**: What the origin country requires for departure
- **Smart Categorization**: Automatically categorizes requirements by health, documentation, quarantine, and general
- **Critical Requirement Flagging**: Highlights mandatory requirements that cannot be skipped
- **Intelligent Caching**: 24-hour in-memory cache to reduce API calls and improve performance
- **Responsive Design**: Mobile-first UI with a clean, trustworthy design

## Technology Stack

### Frontend
- React 18 with TypeScript
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with shadcn/ui components
- Vite for build tooling

### Backend
- Node.js with Express.js
- Perplexity AI API integration
- Zod for runtime validation
- In-memory caching system

## Prerequisites

- Node.js 18+
- npm or yarn
- Perplexity API key ([Get one here](https://www.perplexity.ai/))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/PetTravelGuide.git
cd PetTravelGuide
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PERPLEXITY_API_KEY=your_api_key_here
NODE_ENV=development
```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoint

**POST `/api/pet-travel/requirements`**

Request body:
```json
{
  "origin": "United States",
  "destination": "France",
  "petType": "dog"
}
```

Response:
```json
{
  "origin": "United States",
  "destination": "France",
  "petType": "dog",
  "requirements": [
    {
      "phase": "entry",
      "country": "France",
      "items": [
        {
          "title": "Rabies Vaccination",
          "description": "Must be administered at least 21 days before travel...",
          "critical": true,
          "subcategory": "health"
        }
      ]
    },
    {
      "phase": "exit",
      "country": "United States",
      "items": [...]
    }
  ],
  "lastUpdated": "2024-11-09T..."
}
```

## Project Structure

```
├── client/src/          # React frontend
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   └── lib/            # Utilities and configs
├── server/             # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── perplexity.ts   # AI integration
│   └── storage.ts      # Caching layer
├── shared/             # Shared TypeScript types
│   └── schema.ts       # Zod schemas
└── attached_assets/    # Images and assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PERPLEXITY_API_KEY` | API key for Perplexity AI | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |
| `DATABASE_URL` | PostgreSQL connection string (for future use) | No |

## Design Philosophy

The application follows a hybrid design approach:
- Inspired by travel platforms (Airbnb, Booking.com) for trust and ease-of-use
- Information-dense patterns from government websites for clarity and credibility
- Mobile-first responsive design
- Progressive disclosure from simple selection to detailed requirements

## License

MIT

## Acknowledgments

- Built with [Replit](https://replit.com/)
- AI research powered by [Perplexity AI](https://www.perplexity.ai/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
