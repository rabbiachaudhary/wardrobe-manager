# Pastel Kawaii Wardrobe Management - Design Guidelines

## Design Approach

**Reference-Based Approach**: Pinterest x Hello Kitty aesthetic
- Primary inspiration: Pinterest's card-based layouts + Kawaii culture visual language
- Supporting references: Aesthetic pastel apps, kawaii design patterns
- Core principle: Soft, welcoming, and delightfully cute at every interaction

## Core Design Elements

### A. Typography

**Font Stack** (via Google Fonts CDN):
- Primary headings: Poppins (600-700 weight)
- Body text: Quicksand (400-500 weight)
- Accent text: Nunito or Comfortaa (500 weight)
- Maintain soft, rounded letterforms throughout

**Hierarchy**:
- Page titles: 2xl-3xl, Poppins Bold
- Section headers: xl-2xl, Poppins Semibold
- Card titles: lg-xl, Quicksand Medium
- Body/labels: base-lg, Quicksand Regular
- Buttons: base, Poppins Medium

### B. Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Card padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Element gaps: gap-4 to gap-6
- Border radius: rounded-2xl (16px) to rounded-3xl (24px) for all cards and components

**Grid Systems**:
- Piece/Outfit galleries: 2-4 column responsive grids (grid-cols-2 md:grid-cols-3 lg:grid-cols-4)
- Dashboard widgets: 2-3 column layouts
- Forms: Single column max-w-2xl centered
- All layouts use max-w-7xl containers with generous px-6 to px-8 padding

### C. Color Palette

**Primary Colors** (no specific hex codes - use pastel variants):
- Pastel Pink (primary buttons, accents)
- Lavender (secondary actions, highlights)
- Mint Green (success states, fresh items)
- Baby Blue (info, category tags)
- Cream/White (backgrounds, cards)

**Application**:
- Page backgrounds: Subtle pastel gradient or solid cream
- Cards: White/cream with pastel colored borders (border-2)
- Buttons: Pastel backgrounds with slightly darker text
- Tags/badges: Pastel backgrounds with matching border
- Hover states: Gentle glow effect with soft shadow expansion

### D. Component Library

**Navigation**:
- Top navigation bar with logo (left) and user menu (right)
- Sidebar navigation for main sections (Dashboard, Pieces, Outfits, Analytics)
- Nav items with cute icons from Heroicons (use rounded variants)
- Active state: Pastel background highlight with gentle pulse

**Cards**:
- All content cards: rounded-2xl, soft shadow (shadow-lg), pastel border
- Clothing piece cards: Square image, title below, category/color tags
- Outfit cards: Larger format with outfit image, name, wear count badge
- Hover: scale-105 transform, shadow-xl, subtle glow effect

**Forms & Inputs**:
- Text inputs: rounded-xl, pastel border, soft focus state (ring-2 pastel color)
- Dropdowns/selects: Matching rounded style with cute arrow icons
- File upload: Dashed pastel border with upload icon and "Drop your cute pic here!" text
- Multi-select for outfit builder: Checkbox cards with pastel check icons
- All inputs have generous p-4 padding

**Buttons**:
- Primary: Pastel pink/lavender background, rounded-full, px-8 py-3
- Secondary: Pastel border, transparent background, rounded-full
- Icon buttons: Circular, pastel background, cute icons (hearts, stars, sparkles)
- Hover: Gentle scale (scale-105), deeper shadow

**Badges & Tags**:
- Category tags: Small rounded-full pills with pastel backgrounds
- Season badges: Icon + text in season-appropriate pastel color
- Wear count: Circular badge with number, positioned on card corner
- All use px-3 py-1 with text-xs to text-sm

**Gallery Components**:
- Masonry-style grid option for piece gallery
- Filter bar: Horizontal scrollable tag list with pastel buttons
- Empty states: Cute illustration placeholder with encouraging text

**Analytics Widgets**:
- Stat cards: Large number, icon, label in pastel card
- Progress bars: Rounded-full, pastel gradient fill
- Charts: Pastel color scheme for any data visualization
- Recommendation cards: Outfit preview with "Wear me!" messaging

**Modals & Overlays**:
- Modal backdrop: Soft blur with pastel tint
- Modal content: rounded-3xl, centered, shadow-2xl
- Close button: Top-right, circular with X icon

### E. Visual Elements

**Icons**: Use Heroicons (outline style) via CDN for:
- Stars, hearts, sparkles for decorative accents
- Clothing categories (shirt, pants, shoe icons)
- Navigation items
- Action buttons (edit, delete, add)

**Imagery**:
- Clothing piece images: Square aspect ratio, rounded corners
- Outfit images: Wider aspect ratio (4:3 or 16:9)
- Empty state illustrations: Cute pastel-themed graphics
- All images have subtle border and shadow

**Decorative Elements**:
- Scattered sparkles/stars on page corners
- Soft gradient backgrounds on hero sections
- Subtle pattern overlays (dots, hearts) at low opacity
- Gentle floating animations on decorative icons

### F. Animations (Minimal & Gentle)

- Card hover: scale-105 with transition-transform duration-200
- Button hover: Gentle glow effect, slight scale
- Page transitions: Soft fade-in (no jarring effects)
- Success states: Subtle bounce animation on save
- Loading states: Cute spinner with pastel colors

## Page-Specific Layouts

**Login/Signup**: Centered card (max-w-md), pastel gradient background, cute welcome message
**Dashboard**: 2-3 column grid of stat cards + recent activity feed
**Add Piece/Outfit**: Centered form with image preview, step indicator with pastel circles
**Galleries**: 3-4 column responsive grid, filter bar at top, search with cute icon
**Outfit Builder**: Split view - available pieces (left) + selected pieces preview (right)
**Analytics**: Stat cards row, charts below, recommendations section at bottom

## Key Principles

- **Consistency**: Same border radius, shadow depth, and spacing across all components
- **Softness**: No harsh edges, bright colors, or jarring transitions
- **Delight**: Small touches of cuteness (icons, messages, animations) throughout
- **Clarity**: Despite the cute aesthetic, maintain clear visual hierarchy and usability
- **Breathability**: Generous whitespace, never cramped or cluttered