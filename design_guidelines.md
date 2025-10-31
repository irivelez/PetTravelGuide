# Pet Travel Requirements App - Design Guidelines

## Design Approach

**Hybrid Approach**: Drawing inspiration from travel platforms (Airbnb, Booking.com, Skyscanner) for trust and ease-of-use, combined with information-dense patterns from gov.uk and regulatory websites for clarity and credibility.

**Core Principles**:
- Trust through clarity: Government regulations demand precise, scannable information
- Progressive disclosure: Guide users from simple selection to detailed requirements
- Mobile-first: Travelers plan on-the-go
- Information hierarchy: Critical requirements surface first

## Typography System

**Font Families** (Google Fonts via CDN):
- Primary: Inter (headings, UI elements) - Weights: 400, 500, 600, 700
- Secondary: Source Sans Pro (body text, regulations) - Weights: 400, 600

**Type Scale**:
- Hero/H1: text-5xl md:text-6xl, font-bold, leading-tight
- Section Headers/H2: text-3xl md:text-4xl, font-semibold
- Subsections/H3: text-xl md:text-2xl, font-semibold
- Card Titles/H4: text-lg md:text-xl, font-semibold
- Body Text: text-base leading-relaxed
- Small Text/Labels: text-sm
- Regulatory Text: text-base leading-loose (increased readability)

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16, 20
- Micro-spacing: p-3, gap-4 (within components)
- Component padding: p-6, p-8
- Section spacing: py-12 md:py-16 lg:py-20
- Container gutters: px-4 md:px-6 lg:px-8

**Grid System**:
- Container: max-w-7xl mx-auto for main content
- Requirements display: max-w-4xl mx-auto (optimal reading width)
- Country selector: max-w-2xl mx-auto (focused interaction)

## Page Structure & Sections

### Hero Section (70vh on desktop, auto on mobile)
- **Layout**: Centered content with hero image background
- **Content**: 
  - Main headline emphasizing peace of mind for pet travel
  - Subheadline explaining the service
  - Primary CTA button with blurred background (backdrop-blur-md)
  - Trust indicators: "Researches 190+ countries • Real-time updates"
- **Image**: Warm, professional photo of happy traveler with pet at airport or in airplane cabin

### Country Selection Section (py-16)
- **Layout**: max-w-2xl centered card-based interface
- **Components**:
  - Origin country dropdown with search
  - Destination country dropdown with search
  - Pet type selector (Dog/Cat) with icon buttons
  - Prominent "Check Requirements" button
  - Visual connection between dropdowns (subtle arrow or dotted line)

### Requirements Display Section (py-12)
- **Layout**: max-w-4xl with clear information hierarchy
- **Structure**:
  - Summary card at top with key requirements count
  - Expandable accordion sections for different requirement categories:
    - Health & Vaccination Requirements
    - Documentation & Permits
    - Quarantine Regulations
    - Airline-Specific Rules
    - Entry/Exit Procedures
  - Each section uses icon + title + detailed content
  - Warning/alert boxes for critical requirements
  - Checklist format where applicable

### Additional Sections (Landing Page)

**How It Works** (py-16):
- 3-column grid (grid-cols-1 md:grid-cols-3)
- Step-by-step process with icons
- Each step: large number, icon, title, description

**Why Trust Our Research** (py-16):
- 2-column layout (md:grid-cols-2)
- Sources we check: Government websites, airline policies, veterinary boards
- Real-time verification badge
- Last updated timestamp

**Footer** (py-12):
- 3-column layout on desktop (grid-cols-1 md:grid-cols-3)
- Column 1: About & mission
- Column 2: Quick links (Popular routes, Resources)
- Column 3: Contact information
- Bottom bar: Legal links, last database update

## Component Library

### Navigation
- Sticky header with logo left, navigation links center, CTA right
- Mobile: Hamburger menu with slide-in drawer
- Height: h-16 md:h-20
- Backdrop blur when scrolling

### Cards
- Rounded corners: rounded-xl
- Shadow: shadow-lg with hover:shadow-xl transition
- Padding: p-6 md:p-8
- Border: Optional subtle border (border border-gray-200)

### Buttons
**Primary CTA**:
- Large: px-8 py-4 text-lg font-semibold rounded-full
- Standard: px-6 py-3 text-base font-semibold rounded-lg
- When on images: backdrop-blur-md with semi-transparent background

**Secondary**:
- Outlined style: border-2 px-6 py-3 rounded-lg

### Form Inputs
- Dropdowns/Selects: h-12 md:h-14, rounded-lg, border-2
- Search-enabled dropdowns with flags for countries
- Focus states: ring-4 ring-offset-2

### Icons
- Use Heroicons (via CDN)
- Sizes: h-5 w-5 (inline), h-8 w-8 (feature cards), h-12 w-12 (section headers)
- Icons for: Countries (flags), pets (paw), documents, checkmarks, warnings

### Alert/Warning Boxes
- Info: Soft blue treatment with info icon
- Warning: Amber treatment with exclamation icon
- Critical: Red treatment with alert icon
- Padding: p-4, rounded-lg, border-l-4

### Accordion/Collapsible Sections
- Header: flex justify-between items-center, clickable
- Chevron icon rotation animation
- Content: smooth height transition
- Padding: p-6 when expanded

### Loading States
- Skeleton screens for requirement cards
- Spinner for API calls: h-8 w-8 with spin animation
- Progressive loading messages ("Researching airline policies...")

## Animations

**Minimal & Purposeful**:
- Accordion expand/collapse: 200ms ease-in-out
- Card hover elevation: 150ms ease
- Button press: scale-95 on active
- Loading spinner: continuous rotation
- Page transitions: Fade in content (300ms)

## Images

**Hero Image**:
- Full-width background image with overlay
- Professional travel photography showing person with pet (dog or cat) in travel context
- Warm, reassuring tone
- Position: Background cover with center positioning

**How It Works Icons**:
- Illustrative icons or small images for each step
- Consistent style (line art or flat illustrations)

**Trust Indicators**:
- Subtle background patterns or illustrations of government buildings, airplanes
- Official-looking imagery to convey authority

## Accessibility

- Minimum touch targets: 44x44px on mobile
- High contrast text ratios
- Keyboard navigation for all interactive elements
- ARIA labels for dropdowns and accordions
- Focus indicators: ring-4 with appropriate offset
- Screen reader announcements for loading states
- Semantic HTML throughout (proper heading hierarchy)

## Responsive Behavior

**Mobile (base)**:
- Single column layouts
- Stacked country selectors
- Full-width cards
- Collapsible navigation

**Tablet (md:768px)**:
- 2-column grids where appropriate
- Side-by-side country selectors
- Expanded navigation

**Desktop (lg:1024px)**:
- 3-column grids for features
- Full navigation visible
- Optimal reading widths maintained