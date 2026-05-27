# Project Specs — Vol D'oiseau

## Overview
Premium multilingual boutique website for Elisheva Ifergan's fashion shop in Tel Aviv. Showcases evening gowns, wedding dresses (sale & rental), custom dressmaking, alterations, and sewing classes. Targets Hebrew, French, and English-speaking clients.

## Tech Stack
- **Framework:** Next.js 16.2.6 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Postgres, Storage, RLS)
- **i18n:** next-intl (supports Hebrew RTL, French, English, and additional languages)
- **Deployment:** Vercel (auto-deploy from GitHub)
- **Repository:** https://github.com/ifergantech-lgtm/vol-doiseau

## Pages & User Flows

### Public Pages (app/[locale]/(shop)/)
- **Home** — Hero with shop image, featured collections, CTA
- **Collection** — Browse dresses for sale/rental with filters
- **Services** — Custom dressmaking, alterations, retouching
- **Classes** — Children's and adults' sewing classes with enrollment CTA
- **Contact** — Contact form, WhatsApp link, location, hours

### Admin Pages (app/[locale]/(admin)/)
- Manage dress listings (create, edit, delete, upload images)
- Manage class bookings
- Password-protected with verification

## Data Models

### Dresses (Supabase table: `dresses`)
- `id` (UUID primary key)
- `title` (text) — real dress name, not AI-generated
- `description` (text) — human-written, not AI-generated
- `category` (enum: 'evening' | 'wedding')
- `type` (enum: 'sale' | 'rental' | 'both')
- `price_sale` (numeric, nullable) — sale price in NIS
- `price_rental` (numeric, nullable) — rental price in NIS
- `image_url` (text) — Supabase Storage signed URL
- `locale_visibility` (text array) — ['he', 'fr', 'en']
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Classes (Supabase table: `classes`)
- `id` (UUID primary key)
- `type` (enum: 'children' | 'adults')
- `capacity` (integer) — max participants
- `schedule` (text) — day/time e.g. "Sun–Thu 16:00–18:00"
- `created_at` (timestamp)

### Class Bookings (Supabase table: `class_bookings`)
- `id` (UUID primary key)
- `class_id` (UUID, foreign key)
- `name` (text) — student name
- `phone` (text)
- `email` (text)
- `language` (text) — preferred language
- `created_at` (timestamp)

### Enquiries (Supabase table: `enquiries`)
- `id` (UUID primary key)
- `name` (text)
- `phone` (text)
- `email` (text)
- `message` (text)
- `page` (text) — which page enquiry came from
- `created_at` (timestamp)

## Third-Party Services
- **Supabase** — Database, file storage, RLS policies
- **Vercel** — Hosting, auto-deploy from GitHub
- **WhatsApp** — Floating button for customer contact (phone: +33 378 172 1617)
- **next-intl** — Multilingual routing and translations
- **Higgsfield** — AI image generation (dress photos) — API endpoint: `lib/higgsfield.ts`

## Key Features

### Navigation
- **Desktop:** Fixed navbar with logo (left), nav links (center), language switcher (right)
- **Mobile:** Fixed bottom navigation bar (always visible, no hamburger menu) with 5 links + language switcher
- **Responsive:** Desktop nav hidden on mobile (`md:hidden`); bottom nav hidden on desktop (`md:hidden`)

### Multilingual
- Hebrew (RTL), French, English
- URL structure: `/{locale}/{page}` (e.g., `/he/collection`, `/fr/services`)
- Translations in `/messages/{locale}.json`
- Server-side language detection and routing

### Collections & Search
- Dress gallery with filters by category (evening/wedding) and type (sale/rental)
- Each dress shows title, price (if available), image
- Click to view details → description, full price, contact CTA

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Bottom nav on mobile, desktop nav on tablets+
- Images scale from single column (mobile) to 2–3 columns (desktop)

### Admin Panel
- Password-protected routes
- Dress management: create, edit, delete
- Image uploads to Supabase Storage
- Class booking management
- Enquiry logs

## What "Done" Looks Like

✅ All pages render without errors (build passes)  
✅ Translations work correctly (Hebrew, French, English)  
✅ RTL layout renders properly on Hebrew pages  
✅ Mobile responsive design fully tested (mobile, tablet, desktop)  
✅ Bottom nav appears on mobile, hidden on desktop  
✅ Hamburger menu removed entirely  
✅ No console errors or runtime errors  
✅ Supabase RLS policies protect data correctly  
✅ Vercel deployment synced with latest GitHub code  
✅ All images use signed URLs (no public buckets)  
✅ Dress pricing finalized (awaiting Elisheva's input)  
✅ Higgsfield API endpoint verified and working  

## Current Status

### ✅ Completed
- Homepage with hero, featured collections, CTAs
- Collection page (structure complete, awaiting pricing)
- Services page
- Classes page (fully responsive, bottom nav integrated)
- Navbar (hamburger removed, desktop nav working)
- BottomNav component (mobile-only navigation bar)
- i18n setup (Hebrew RTL, French, English)
- Supabase schema and RLS policies
- GitHub repo created and synced
- Vercel deployment active

### ⏳ Pending
- **Dress pricing** — awaiting Elisheva's sale & rental prices
- **Rock Rentals image** — database record deleted, verify removed from live site
- **Dress inventory** — add remaining dresses from Higgsfield with real names/descriptions (not AI)
- **Contact form backend** — receive enquiries into Supabase
- **Class booking form backend** — process and store bookings

### 🔧 Known Issues
- Hamburger menu still showing on live site (deployment/caching issue being investigated)
- Social media automation feature built but requires API key migration
- Higgsfield BASE_URL in `lib/higgsfield.ts` is best-guess, needs verification

## Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=+33378172161

7
HIGGSFIELD_API_KEY=
NEXT_PUBLIC_HIGGSFIELD_BASE_URL=
```

## Running Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deployment
All pushes to `main` branch auto-deploy to Vercel at https://vol-doiseau.vercel.app

---

**Last Updated:** 2026-05-27  
**Approved By:** [Pending]
