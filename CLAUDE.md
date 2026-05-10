# George Gagoshidze Artist Website — Claude Code Briefing

## What we're building

A portfolio website for Georgian artist George Gagoshidze, replacing an existing Shopify store at georgegagoshidze.com. The site has no e-commerce checkout — visitors contact George directly to enquire about purchasing. The site must have a public-facing portfolio and a private admin panel where George can manage his artworks.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Hosting**: Vercel (free tier), GitHub repo: https://github.com/gagoshidzeart/George-Gagoshidze-Website
- **Database**: Supabase (Postgres) — stores artwork metadata
- **Image storage**: Cloudinary — stores and serves all artwork images
- **Auth**: Supabase Auth with Google OAuth — only one whitelisted Gmail may access /admin
- **Styling**: Tailwind CSS

## Credentials (environment variables)

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=https://fswgfpyvlscyeokjsagt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DcDwvARGpXtnp98Uay6SoQ_MUMuy-lT
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase Settings → API>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dwzj5y97z
CLOUDINARY_API_KEY=339365182196428
CLOUDINARY_API_SECRET=<paste your Cloudinary API secret here>
ADMIN_EMAIL=gagoshidze.art@gmail.com
```

Never commit `.env.local` to Git. Make sure `.gitignore` includes it.

## Database schema (Supabase)

Run this SQL in the Supabase SQL editor:

```sql
create table collections (
  id uuid default gen_random_uuid() primary key,
  handle text unique not null,
  title text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table artworks (
  id uuid default gen_random_uuid() primary key,
  handle text unique not null,
  title text not null,
  year integer,
  dimensions text,
  medium text,
  price numeric,
  sold boolean default false,
  collection_id uuid references collections(id),
  description text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table artwork_images (
  id uuid default gen_random_uuid() primary key,
  artwork_id uuid references artworks(id) on delete cascade,
  cloudinary_public_id text not null,
  cloudinary_url text not null,
  position integer default 0,
  alt_text text,
  created_at timestamptz default now()
);

alter table artworks enable row level security;
alter table artwork_images enable row level security;
alter table collections enable row level security;

create policy "Public read artworks" on artworks for select using (true);
create policy "Public read images" on artwork_images for select using (true);
create policy "Public read collections" on collections for select using (true);
create policy "Admin insert artworks" on artworks for insert with check (auth.role() = 'authenticated');
create policy "Admin update artworks" on artworks for update using (auth.role() = 'authenticated');
create policy "Admin delete artworks" on artworks for delete using (auth.role() = 'authenticated');
create policy "Admin insert images" on artwork_images for insert with check (auth.role() = 'authenticated');
create policy "Admin update images" on artwork_images for update using (auth.role() = 'authenticated');
create policy "Admin delete images" on artwork_images for delete using (auth.role() = 'authenticated');
create policy "Admin insert collections" on collections for insert with check (auth.role() = 'authenticated');
create policy "Admin update collections" on collections for update using (auth.role() = 'authenticated');
create policy "Admin delete collections" on collections for delete using (auth.role() = 'authenticated');
```

## Site structure

```
/                        → Homepage: hero image, featured artworks grid, collections
/works                   → All artworks (filterable by collection)
/works/[handle]          → Individual artwork page
/collections/[handle]    → Collection page
/about                   → About George (static content)
/contact                 → Contact form
/admin                   → Redirects to /admin/login if not authenticated
/admin/login             → Google OAuth login page
/admin/artworks          → List all artworks
/admin/artworks/new      → Add new artwork
/admin/artworks/[id]     → Edit artwork
/admin/collections       → Manage collections
```

## Design — CRITICAL: pixel-perfect replica of the existing Shopify site

**The new site must look IDENTICAL to the live site at georgegagoshidze.com. Visit it and inspect every detail before writing any CSS. The following values come directly from the Shopify theme's settings_data.json — use them exactly.**

### Fonts
- **Both headings and body**: Bricolage Grotesque, available on Google Fonts
- Import: `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400&display=swap')`
- Weight 400 throughout — the theme uses a single weight
- Do NOT use Cormorant Garamond, Jost, or any other font

### Colours (from theme color_schemes)
- **Page background**: `#fcfcfc`
- **Primary text**: `#103948` (dark teal-blue — used for all body text, headings, nav links)
- **Buttons background**: `#103948`
- **Button label**: `#fcfcfc`
- **Secondary background** (scheme-2): `#ebeced`
- **Dark accent** (scheme-3): `#052c46`
- **Terracotta accent** (scheme-4, used for sold/sale badges): `#bc5631`
- **Teal accent** (scheme-5): `#18566c`

### Layout
- **Max page width**: 1200px, centred
- **Grid spacing**: 40px horizontal and vertical between items
- **Section spacing**: 0 (sections sit flush against each other)

### Cards (artwork grid)
- Style: standard
- No border (`card_border_thickness: 0`)
- No shadow (`card_shadow_opacity: 0`)
- No corner radius (`card_corner_radius: 0`)
- No image padding (`card_image_padding: 0`)
- Text alignment: center
- Images: 3:4 aspect ratio

### Buttons
- Border radius: 40px (pill-shaped)
- Border thickness: 1px
- Slight shadow (opacity 10%, offset 2px, blur 5px)

### Sold / Sale badges
- Background: `#bc5631` (scheme-4 terracotta)
- Text: `#fcfcfc`
- Border radius: 40px (pill-shaped)
- Position: bottom left of image

### Other details
- No card borders anywhere
- No image corner radius
- Scroll reveal animations on elements
- No hover effects on elements (`animations_hover_elements: none`)
- Navigation: visit live site and match exactly — logo left, links right, announcement bar at top
- Footer: match live site exactly — social links, copyright, policies

## Admin panel design

Clean, functional, dark-themed dashboard (separate visual identity from public site):
- Sidebar: Artworks, Collections, Settings
- Top bar: Google avatar + email
- Artwork list: thumbnail, title, year, price, available/sold badge, edit/delete
- Add/edit form: title, year, dimensions, medium, price, sold toggle, collection selector, drag-and-drop multi-image uploader, description
- Image uploader: uploads to Cloudinary, stores public_id + URL in Supabase
- Only gagoshidze.art@gmail.com may access — all others get "Access denied"

## Auth flow

1. /admin → redirect to /admin/login if no session
2. "Sign in with Google" button
3. After OAuth: check email === process.env.ADMIN_EMAIL
4. If not → sign out, show "Access denied"
5. If yes → redirect to /admin/artworks

## Migration data

- 203 artworks in products_export.csv (project root)
- 326 images in paintings/ folder (project root), organised by handle (e.g. paintings/fortress/2.jpg)
- Write scripts/migrate.ts that:
  1. Reads products_export.csv
  2. Uploads images from paintings/ to Cloudinary (folder: gagoshidze/artworks/[handle]/)
  3. Inserts metadata into Supabase artworks table
  4. Links images in artwork_images table
  5. Idempotent — skips already-done items, safe to re-run

## Collections (seed in this order)

1. Latest Works — handle: latest-works (2025–2026 artworks)
2. Ukraine is Georgia is Ukraine — handle: ukraine-is-georgia-is-ukraine
3. 2019–2021 — handle: 2019-2021
4. 2016–2018 — handle: 2016-2018
5. 2014–2015 — handle: 2014-2015
6. 2012–2013 — handle: 2012-2013
7. 2010–2011 — handle: 2010-2011

## Contact form

Fields: Name, Email, Message, optional artwork dropdown. Sends email to gagoshidze.art@gmail.com via Resend (free tier). No database storage.

## Key requirements

- Cloudinary: use f_auto and q_auto on all image URLs
- Use Next.js Image component with correct sizes
- Mobile responsive
- Sold artworks: visible, marked sold, no price, no enquire button, terracotta badge
- Admin restricted to gagoshidze.art@gmail.com — enforced server-side in all API routes
- All data-modifying API routes verify Supabase session

## First steps

1. `npx create-next-app@latest . --typescript --tailwind --app`
2. `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs cloudinary next-cloudinary`
3. Create `.env.local`
4. Run SQL schema in Supabase
5. Build public site (homepage → works → artwork detail)
6. Build admin panel
7. Write and run migration script

## Additional CSS details from theme.liquid

These values come directly from the Shopify theme.liquid and must be replicated exactly in the Next.js CSS:

```css
/* Font scale multipliers */
/* body_scale: 110 → font-body-scale: 1.1 */
/* heading_scale: 120 → font-heading-scale: 120/110 ≈ 1.09 */

html {
  font-size: calc(1.1 * 62.5%); /* = 68.75% → 1rem = 6.875px */
  box-sizing: border-box;
}

body {
  display: grid;
  grid-template-rows: auto auto 1fr auto; /* announcement bar, header, main, footer */
  grid-template-columns: 100%;
  min-height: 100%;
  margin: 0;
  font-size: 1.5rem;   /* mobile */
  letter-spacing: 0.06rem;
  line-height: 1.727;  /* calc(1 + 0.8 / 1.1) */
  font-family: 'Bricolage Grotesque', sans-serif;
  color: rgba(16, 57, 72, 0.75); /* #103948 at 75% opacity — NOT full opacity */
  background-color: #fcfcfc;
}

@media (min-width: 750px) {
  body { font-size: 1.6rem; }
}

/* Grid spacing */
/* Desktop: 40px horizontal, 40px vertical */
/* Mobile: 20px horizontal, 20px vertical (halved) */

/* Page width: 1200px max, centred */
/* Section spacing: 0px (sections flush against each other) */
```

**Critical detail**: body text colour is `rgba(#103948, 0.75)` — 75% opacity — giving it a slightly muted appearance. Do not use full opacity `#103948` for body text.

## Header structure (from sections/header.liquid)

### Layout
- Logo position: **middle-left** — logo on the left, nav links in the centre/right
- Mobile logo position: **centre**
- Sticky behaviour: **on-scroll-up** — header hides when scrolling down, slides back in when scrolling up
- Bottom border: **yes** — thin separator line below header
- Header padding: 20px top, 20px bottom desktop; 10px top, 10px bottom mobile
- Header horizontal padding: 3rem on all screen sizes

### Desktop header structure (left → right)
1. **Logo** (left): site name as text `<span class="h2">George Gagoshidze</span>` since no image logo — links to homepage
2. **Nav menu** (centre): inline list of links — About, Works (→/works), Projects, Contact... wait:
3. **Right icons area**: Contact link (hardcoded `<a href="/pages/contact">`), Search icon, Account icon, Cart icon

**Important**: The Contact link is NOT in the main nav menu — it is hardcoded in the header icons area on the right side. Replicate this exactly.

### Nav menu links (main-menu)
From the live site: About | Shop (→ Works) | Projects | Contact
In our version: About | Works | Projects | Contact

### Mobile header
- Hamburger menu button (left) opens a drawer
- Logo centred
- Cart icon (right)
- Full nav links appear in the slide-in drawer

### What to omit in our version (no Shopify features needed)
- No cart icon or cart functionality
- No account/login icon (we have our own /admin)
- No search modal (optional, can add later)
- No country/language selector
- Keep: logo, nav links, Contact shortcut on right, sticky behaviour, mobile drawer

### Sticky header behaviour
Implement with a scroll listener in JavaScript:
- On scroll down past header height → add class `header-hidden` (translateY(-100%))
- On scroll up → remove `header-hidden`, add `header-sticky` with transition
- At top of page → reset to normal static position
- CSS transition: `transform 0.3s ease`

## Footer structure (from sections/footer.liquid)

### Layout (two sections)

**Top section** (`footer__content-top`) — contains blocks + social icons:
- Social icons block (Facebook, Instagram, LinkedIn, Behance — from settings)
- Brand headline: "Follow me on social media"
- No newsletter (omit in our version)

**Bottom section** (`footer__content-bottom`) — two rows:

Row 1 — left/right split:
- Left: country/language selector (omit in our version)
- Right: payment icons — Visa, Mastercard, PayPal, Apple Pay, Google Pay

Row 2 — copyright bar:
- `© 2026, George Gagoshidze` (linked to homepage)
- Policy links: Privacy policy, Shipping policy, Refund policy, Contact information, Terms of service

### Spacing
- Footer padding: 36px top, 36px bottom (desktop); ~27px top/bottom (mobile, ×0.75)
- Footer margin-top: 0px

### Colour scheme
- scheme-1: background `#fcfcfc`, text `#103948` — same as rest of site

### What to include in our version
- Social icons row: Facebook, Instagram, LinkedIn, Behance (link to actual profiles)
- Payment icons row: Visa, Mastercard, PayPal, Apple Pay, Google Pay (static SVGs, decorative only — no actual payment processing)
- Copyright: © 2026, George Gagoshidze
- Policy links: Privacy policy, Shipping policy, Refund policy, Terms of service (these can be simple static pages)
- Omit: newsletter signup, country/language selector, "Follow on Shop" button

### Social links (from settings_data.json)
- Facebook: https://www.facebook.com/georgegagoshidze
- Instagram: https://www.instagram.com/georgegagoshidze
- LinkedIn: https://www.linkedin.com/in/george-gagoshidze-45100aa6/
- Behance: https://www.behance.net/GeorgeGagoshidze

## Base CSS details (from assets/base.css)

These are the exact CSS rules from the Shopify theme. Replicate them precisely.

### Page width & padding
```css
.page-width {
  max-width: 1200px; /* var(--page-width) */
  margin: 0 auto;
  padding: 0 1.5rem; /* mobile */
}
@media (min-width: 750px) {
  .page-width { padding: 0 5rem; }
  .header.page-width { padding-left: 3.2rem; padding-right: 3.2rem; }
}
@media (min-width: 990px) {
  .header:not(.drawer-menu).page-width { padding-left: 5rem; padding-right: 5rem; }
}
```

### Typography scale
```css
/* font-heading-scale = 120/110 = 1.0909 */
h1 { font-size: calc(1.0909 * 3rem) = ~3.27rem mobile, ~4.36rem desktop }
h2 { font-size: calc(1.0909 * 2rem) = ~2.18rem mobile, ~2.62rem desktop }
h3 { font-size: calc(1.0909 * 1.7rem) = ~1.85rem mobile, ~1.96rem desktop }
/* All headings: letter-spacing: calc(1.0909 * 0.06rem) ≈ 0.065rem */
/* Heading line-height: calc(1 + 0.3 / max(1, 1.0909)) ≈ 1.275 */
/* Body text colour: rgb(16,57,72) at 75% opacity on headings is FULL opacity */
h1,h2,h3,h4,h5 { color: rgb(16,57,72); } /* full opacity on headings */
body { color: rgba(16,57,72, 0.75); } /* 75% on body text */
```

### Header grid layout (desktop, middle-left logo)
```css
.header {
  display: grid;
  grid-template-areas: 'heading navigation icons';
  grid-template-columns: auto auto 1fr;
  column-gap: 2rem;
  align-items: center;
}
/* heading = logo (left), navigation = nav links (centre), icons = right side */
```

### Header menu item styling
```css
.header__menu-item {
  padding: 1.2rem;
  text-decoration: none;
  color: rgba(16,57,72, 0.75); /* 75% opacity */
}
.header__menu-item:hover {
  color: rgb(16,57,72); /* full opacity */
}
.header__menu-item:hover span {
  text-decoration: underline;
  text-underline-offset: 0.3rem;
}
.header__heading-link .h2 {
  line-height: 1;
  color: rgba(16,57,72, 0.75); /* logo text at 75% */
}
.header__heading-link:hover .h2 {
  color: rgb(16,57,72); /* full on hover */
}
```

### Header border
```css
.header-wrapper--border-bottom {
  border-bottom: 0.1rem solid rgba(16,57,72, 0.08); /* very subtle */
}
```

### Sticky header behaviour
```css
.shopify-section-header-sticky { position: sticky; top: 0; }
.shopify-section-header-hidden { top: calc(-1 * var(--header-height)); }
.section-header.animate { transition: top 0.15s ease-out; }
```

### Scroll reveal animations
```css
/* Elements slide up 2rem and fade in on scroll */
.scroll-trigger.animate--slide-in {
  opacity: 0.01;
  transform: translateY(2rem);
}
/* Animation: slideIn 600ms cubic-bezier(0,0,0.3,1) forwards */
/* Staggered delay: calc(var(--animation-order) * 75ms) */
@keyframes slideIn {
  from { transform: translateY(2rem); opacity: 0.01; }
  to   { transform: translateY(0);    opacity: 1; }
}
```

### Grid system
```css
.grid {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px; /* mobile: 40px/2 */
  row-gap: 20px;    /* mobile: 40px/2 */
}
@media (min-width: 750px) {
  .grid { column-gap: 40px; row-gap: 40px; } /* desktop */
}
/* 4-col desktop grid item: calc(25% - 40px * 3/4) = calc(25% - 30px) */
```

### Artwork dimensions text (custom addition in base.css)
```css
.card-product__dimensions {
  font-size: 1.00rem;
  opacity: 0.7;
  margin-top: 4px;
  letter-spacing: 0.02em;
}
```

### Sold-out price styling
```css
/* Price fades to 40% opacity when artwork has a sold badge */
.card-wrapper:has(.card__badge .badge) .price {
  opacity: 0.4;
}
```

### Badge styling
```css
.badge {
  border-radius: 4rem; /* pill shape, var(--badge-corner-radius) = 40px / 10 = 4rem */
  font-size: 1.2rem;
  letter-spacing: 0.1rem;
  padding: 0.5rem 1.3rem 0.6rem;
  border: 1px solid transparent;
}
```

### Links
```css
.link { text-underline-offset: 0.3rem; text-decoration-thickness: 0.1rem; }
.link--text { color: rgb(16,57,72); }
.link--text:hover { color: rgba(16,57,72, 0.75); }
```

### Animation durations (CSS variables)
```css
--duration-short: 100ms
--duration-default: 200ms
--duration-medium: 300ms
--duration-long: 500ms
--duration-extra-long: 600ms   /* used for slideIn animation */
--ease-out-slow: cubic-bezier(0, 0, 0.3, 1)
```

### Announcement bar
```css
.announcement-bar__message {
  text-align: center;
  padding: 1rem 0;
  letter-spacing: 0.1rem;
  min-height: 3.8rem;
}
```

### Contact link — hidden from nav, shown in header icons
```css
/* Contact is hidden from the inline nav menu */
.header__inline-menu a[href*="contact"],
.header__menu-item a[href*="contact"] {
  display: none !important;
}
/* Contact appears as a separate link in the header icons area on the right */
```
