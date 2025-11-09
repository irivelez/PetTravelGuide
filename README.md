# 🐾 Pet Travel Guide

AI-powered research tool for international pet travel requirements

⏱️ **Build time:** ~3 hours  
🛠️ **Built with:** Replit, Perplexity AI  
🎯 **Purpose:** Help pet owners research travel requirements for dogs and cats across countries

## What It Does

This web application helps pet owners navigate the complex requirements for traveling internationally with pets. It uses AI-powered research through the Perplexity API to search official government sources and present organized, actionable requirements.

Key capabilities:

- 🤖 AI-powered research using Perplexity to find official government sources
- 📝 Organizes requirements into entry (destination) and exit (origin) phases
- 🏷️ Smart categorization by health, documentation, quarantine, and general requirements
- ⚠️ Flags critical mandatory requirements
- ⚡ 24-hour intelligent caching to reduce API calls
- 📱 Mobile-first responsive design

## Tech Stack

**Frontend:**
- **React 18** with TypeScript
- **Wouter** - Client-side routing
- **TanStack Query** - Server state management
- **Tailwind CSS** with shadcn/ui components
- **Vite** - Build tooling

**Backend:**
- **Node.js** with Express
- **Perplexity AI API** - AI-powered research
- **Zod** - Runtime validation
- In-memory caching system

## Quick Start

### Prerequisites

- Node.js 18+
- Perplexity API key ([Get one here](https://www.perplexity.ai/))
- Replit account (for easy deployment) or local development environment

### Setup

#### Option 1: Deploy on Replit (Easiest)

1. Fork this repository on Replit
2. Add your Perplexity API key in Secrets:
   - Key: `PERPLEXITY_API_KEY`
   - Value: Your API key
3. Click "Run"
4. Your app will be live at your Replit URL

#### Option 2: Local Development

1. Clone the repository:

```bash
git clone https://github.com/irivelez/PetTravelGuide.git
cd PetTravelGuide
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```
PERPLEXITY_API_KEY=your_api_key_here
NODE_ENV=development
```

4. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## How It Works

### The System

The application combines a React frontend with an Express backend that interfaces with Perplexity AI:

1. **User Input**: Select origin country, destination country, and pet type (dog/cat)
2. **AI Research**: Backend queries Perplexity AI with structured prompts to search official sources
3. **Data Processing**: Response is parsed and organized into entry/exit requirements
4. **Smart Categorization**: Requirements are automatically categorized and critical items are flagged
5. **Caching**: Results are cached for 24 hours to improve performance
6. **Display**: Frontend presents organized, easy-to-understand requirements

## Output

The application provides:

- **Entry Requirements**: What the destination country requires
- **Exit Requirements**: What the origin country requires for departure
- **Categorized Information**: Health, documentation, quarantine, and general requirements
- **Critical Alerts**: Mandatory requirements highlighted
- **Source References**: Links to official government sources when available

## Features

- AI-powered research from official government sources
- Dual-phase requirement organization (entry/exit)
- Smart categorization system
- Critical requirement flagging
- 24-hour intelligent caching
- Mobile-responsive design
- Clean, trustworthy UI inspired by travel platforms
- TypeScript for type safety
- Real-time loading states and error handling

## Limitations

- Requires active Perplexity API key (paid service)
- Research quality depends on availability of official government sources
- Cached results may not reflect very recent regulation changes
- Currently supports dogs and cats only
- English language interface only
- No database persistence (in-memory cache only)


---

*Part of [thexperiment.dev](https://thexperiment.dev) - Projects by non-tech people for non-tech people*
