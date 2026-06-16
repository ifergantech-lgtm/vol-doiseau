# Vol D'Oiseau — SEO Strategy & Content Plan

_Last updated: 2026-06-17. Companion to the technical SEO work already shipped (see "What's already live" at the bottom)._

This document is the playbook for growing Vol D'Oiseau's visibility in Google and in AI assistants (ChatGPT, Claude, Perplexity, Google AI). It covers: the keywords each page should own, what new content to create, ready-to-write briefs, and how to get the boutique recommended by AI.

---

## 1. Keyword clusters (one cluster = one page)

The golden rule: **each page targets ONE cluster** so your pages never compete with each other. Primary keywords are listed in English / French / Hebrew (your three main markets).

### Cluster A → Home page (`/`)
**Brand / discovery.** Intent: navigational + broad.
- Vol D'Oiseau · Vol D'Oiseau Tel Aviv · Élisheva Ifergan
- boutique robes Tel Aviv · maison de couture Tel Aviv
- בוטיק שמלות תל אביב · וול דואזו

### Cluster B → Collection, evening view (`/collection`)
**Evening gowns.** Intent: commercial / transactional.
- evening gown rental Tel Aviv · evening dress rental Israel · designer evening gowns Tel Aviv
- location robe de soirée Tel Aviv · robe de soirée Tel Aviv
- השכרת שמלות ערב תל אביב · שמלות ערב תל אביב · שמלת ערב להשכרה

### Cluster C → Collection, wedding view (`/collection?type=wedding`)
**Wedding dresses.** Intent: commercial / transactional.
- wedding dress rental Tel Aviv · bridal gowns Tel Aviv · buy wedding dress Israel
- robe de mariée Tel Aviv · location robe de mariée Tel Aviv
- שמלות כלה תל אביב · השכרת שמלת כלה · שמלת כלה להשכרה

### Cluster D → Services, dressmaking (`/services`)
**Bespoke dressmaking.** Intent: commercial.
- custom dressmaker Tel Aviv · made-to-measure dress Israel · bespoke evening gown
- couturière Tel Aviv · robe sur mesure Tel Aviv
- תופרת תל אביב · תפירת שמלות בהזמנה · שמלה בעבודת יד

### Cluster E → Alterations (sub-section of `/services`; candidate for its own page later)
**Alterations.** Intent: local / commercial — high-frequency local search.
- dress alterations Tel Aviv · wedding dress alterations Tel Aviv · clothing tailor Tel Aviv
- retouche robe Tel Aviv · retouche vêtements Tel Aviv
- תיקוני בגדים תל אביב · תיקון שמלות · הצרת שמלה

### Cluster F → Sewing classes (`/classes`)
**Sewing classes.** Intent: local / commercial.
- sewing classes Tel Aviv · sewing lessons for kids Tel Aviv · adult sewing course Tel Aviv
- cours de couture Tel Aviv · cours de couture enfants
- קורס תפירה תל אביב · חוג תפירה לילדים · שיעורי תפירה למבוגרים

### Cluster G → Contact (`/contact`)
**Local / visit.** Intent: navigational / local.
- Vol D'Oiseau King George · dress boutique King George Tel Aviv
- boutique robe King George Tel Aviv · בוטיק שמלות קינג ג'ורג'

> **Note on the alterations cluster (E):** it's currently folded into the Services page. "Dress alterations Tel Aviv" is a strong, high-intent local search. Giving alterations its **own page** (`/services/alterations`) is the single best on-page opportunity once content is ready.

---

## 2. Content strategy

The site is visually beautiful but **light on text**, which limits how many searches it can match. The plan below adds genuinely useful content — not filler — that targets buyer questions and feeds AI assistants accurate facts.

### Topical authority map
```
Vol D'Oiseau (boutique)
├── Evening & wedding wear (Collection)
│   ├── Rental guide (how renting works)
│   └── Buy vs rent a wedding dress
├── Atelier (Services)
│   ├── Bespoke dressmaking process
│   └── Alterations guide  ← own page
└── Sewing school (Classes)
    └── Kids' sewing classes — parent's guide
```

### Priority queue (do the quick wins first)

| # | Piece | Targets cluster | Type | Why |
|---|-------|-----------------|------|-----|
| 1 | **FAQ block** on Services, Classes & Contact | D, E, F, G | FAQ + schema | Quick win. Earns "People also ask" results and gives AI direct answers. |
| 2 | **Rental guide**: "How dress rental works at Vol D'Oiseau" | B, C | Guide (~900w) | Captures high-intent "rental Tel Aviv" searches. |
| 3 | **Buy vs rent your wedding dress in Tel Aviv** | C | Comparison (~1,100w) | Bottom-funnel; brides actively compare. |
| 4 | **Alterations page** (`/services/alterations`) | E | Service page (~700w) | Unlocks a whole high-frequency local cluster. |
| 5 | **Bespoke dressmaking: what to expect** | D | Guide (~900w) | Builds trust for the highest-value service. |
| 6 | **Kids' sewing classes — a parent's guide** | F | Guide (~800w) | Parents research before enrolling; long-tail. |

### Suggested cadence
One piece every 1–2 weeks, written first in **Hebrew, French and English** (your live markets), then optionally the other five languages. Reuse the translation approach already in place (see §4).

---

## 3. Content briefs (ready to write)

### Brief 1 — FAQ (quick win)
- **Where:** add an FAQ section to `/services`, `/classes`, and `/contact`, each with `FAQPage` schema (the `JsonLd` component + a `faqSchema()` builder — easy to add to `lib/schema.ts`).
- **Questions to answer (real customer questions):**
  - Do you rent dresses, or only sell them?
  - Do you carry wedding dresses as well as evening gowns?
  - How far in advance should I book a fitting?
  - Do you do alterations on a dress I bought elsewhere?
  - How long do alterations take?
  - What languages do you speak in the boutique? (Hebrew, French, English…)
  - Where are you and how do I get there? (King George 6, Tel Aviv)
  - How do prices work? (on enquiry, via WhatsApp)
- **Keywords to weave in:** dress rental Tel Aviv, alterations Tel Aviv, wedding dress fitting.
- **Schema:** `FAQPage`.

### Brief 2 — "Evening gown & wedding dress rental in Tel Aviv: how it works"
- **Primary keyword:** evening gown rental Tel Aviv (FR: location robe de soirée Tel Aviv; HE: השכרת שמלות ערב תל אביב)
- **Intent:** commercial. **Length:** 800–1,000 words. **Type:** guide.
- **Outline:**
  - H1: Dress rental in Tel Aviv at Vol D'Oiseau
  - H2: What you can rent (evening gowns, wedding dresses)
  - H2: How rental works (enquiry → fitting → collection → return)
  - H2: Rental vs buying — which is right for you (link to Brief 3)
  - H2: Booking a fitting (WhatsApp / visit King George 6)
  - H2: FAQ (3–4 questions)
- **Internal links:** → Collection, → Contact, → Buy-vs-rent article.
- **Schema:** Article + FAQ. **CTA:** WhatsApp enquiry.

### Brief 3 — "Should you buy or rent your wedding dress in Tel Aviv?"
- **Primary keyword:** buy or rent wedding dress (HE: לקנות או להשכיר שמלת כלה)
- **Intent:** commercial/comparison. **Length:** 1,000–1,300 words.
- **Outline:**
  - H1: Buy or rent your wedding dress? An honest guide
  - H2: When renting makes sense (budget, one wear, travel)
  - H2: When buying makes sense (keepsake, heavy alterations, custom)
  - H2: A comparison table (cost, alterations, timeline, keepsake)
  - H2: The Vol D'Oiseau approach (both options, plus bespoke)
  - H2: FAQ
- **Internal links:** → Collection (wedding), → Services (bespoke), → Contact.
- **Schema:** Article + FAQ (+ a comparison table AI can quote).

---

## 4. Multilingual / international SEO

Already correct and live (verified): hreflang for all 8 languages + `x-default`, per-locale `<html lang/dir>` (RTL for Hebrew & Arabic), self-referencing canonicals, and a localized sitemap. When adding new content:
- **Research keywords per language** — don't translate word-for-word. "Wedding dress rental" and "השכרת שמלת כלה" can have very different demand.
- Translate **title, description, H1, body, image alt, and schema text** — not just the body.
- Keep internal links pointing to the **same language**.
- Optional future upgrade: localize URL slugs (e.g. `/he/collection` → a Hebrew slug). Higher effort; only worth it if Hebrew organic traffic grows.

---

## 5. AI visibility (getting recommended by ChatGPT / Claude / Perplexity)

On-site (done or easy):
- ✅ Clean server-rendered content + structured data (LocalBusiness, Product, Breadcrumb, Course).
- ✅ AI crawlers allowed in `robots.txt`; `llms.txt` published at `/llms.txt`.
- ⬜ Add FAQ schema (Brief 1) — AI assistants quote FAQ answers directly.

Off-site (owner actions — these matter most for AI + local SEO):
1. **Google Business Profile** — claim/complete it (hours, photos, services, languages). This is the #1 driver for "dress boutique in Tel Aviv" in both Google Maps and AI answers.
2. **Reviews** — ask happy clients for Google reviews. AI models weight review sentiment heavily.
3. **Consistent NAP** — Name, Address (King George 6, Tel Aviv), Phone identical everywhere (Instagram, Google, directories).
4. **Local directories & wedding platforms** — list on Israeli wedding/fashion directories; these get cited by AI.
5. **Instagram → website** — keep the bio link pointing to the site; AI cross-references social presence.

---

## What's already live (shipped this round)

- `sitemap.xml` (all pages × 8 languages + every dress, with hreflang) and `robots.txt`.
- Unique, translated `<title>` + meta description on every page, in all 8 languages.
- Full hreflang + `x-default`, per-locale canonical URLs.
- Server-rendered `<html lang/dir>` — correct language & RTL on first paint.
- Structured data: LocalBusiness/ClothingStore + WebSite (home & contact), Product + Breadcrumb (each dress), Course + Breadcrumb (classes).
- Open Graph / social-share tags + web manifest.
- Internal linking: footer navigation site-wide, dress-page breadcrumbs, and a "you may also like" related-dresses section.
- `llms.txt` for AI assistants.

The biggest remaining lever is **off-site**: Google Business Profile + reviews. The biggest on-site lever is **the FAQ + the alterations page**.
