# Infinity French Doors — website

Marketing site for Infinity French Doors (Nashik / Jalgaon), rebuilt with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**.

Motion stack: **Lenis** (smooth scrolling), **Motion** (`motion/react`, scroll reveals, parallax, 3D tilt, magnetic buttons, page transitions) and **Three.js via React Three Fiber + drei** (the interactive 3D French door in the hero).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages are statically generated)
npm start
```

## Where things live

| Path | What it is |
|---|---|
| `src/data/site.ts` | **All site copy and image URLs** — products, nav, FAQs, testimonials, leadership, timeline, gallery, business details. Edit content here. |
| `src/app/` | Routes: `/`, `/about-us`, `/products/[slug]`, `/projects/[slug]`, `/gallery/[[...filter]]`, `/videos`, `/contact-us` |
| `src/components/` | Header (sticky, dropdowns, mobile drawer), Footer, Hero (3D door + slideshow), Testimonials, FAQ accordion, Lightbox / ImageGrid, Counter, ContactBlock, shared blocks (PageHeader, CtaBanner, ProductCard, SectionHeading) |
| `src/components/motion/` | `SmoothScroll` (Lenis), `ScrollProgress`, `Reveal` / `Stagger` / `WordReveal`, `ParallaxImage` / `ParallaxLayer`, `TiltCard`, `Magnetic`, `TextMarquee` |
| `src/components/three/DoorScene.tsx` | Procedural 3D French door (frame, two hinged leaves, muntins, transom, gold hardware). Leaves open with scroll and on hover; the door tilts toward the cursor. Loaded client-side only. |
| `src/app/globals.css` | Tailwind theme tokens (navy / brand blue / gold / cream), fonts, button + card component classes, animations |
| `next.config.ts` | Remote image host allow-list and redirects from the old site's broken / misspelled URLs |

Images are loaded directly from `https://www.infinitywindoors.com` (the current live site). Before go-live, copy them into `public/` (or a CDN) and update the `IMG` / `UPL` constants at the top of `src/data/site.ts`.

## Contact form

`ContactBlock` validates the fields, then posts JSON to `NEXT_PUBLIC_FORM_ENDPOINT` (any form service such as Formspree or Web3Forms) when it is set. Without it, the visitor's email app opens with the enquiry pre-filled to the business address. This works on static hosting; see the GitHub Pages section below.

## Content fixes applied vs. the old site

- `/products/doors` is now an overview of all ranges instead of an empty page.
- Safety Doors page has its own heading (was the Combination Doors heading).
- "Garden Banches" → "Garden Benches" everywhere; old `garden-banches` URLs redirect.
- Home product cards link to the correct `/products/...` paths; the old broken paths redirect.
- Placeholder sub-product "garden-banches" renamed to "RCC Garden Bench".
- FAQ "How can I make a change to my application?" rewritten as "…to my order?" with an answer (confirm wording with the client).
- Footer template text about the "advertising sector" replaced; copyright year is dynamic.
- Brand name standardised to "Infinity French Doors" (legal name "Infinity Windoors Pvt Ltd" in footer).
- Typos fixed (Unknown, fitted, finished, throughout, "13 years of experience").
- Stray laptop stock photo removed from the gallery; a few catalogue photos added so each filter has content.
- Co-founder spelled "Dhiraj Mahajan" consistently — **confirm the correct spelling with the client**.
- Comparison table: cells missing on the old site are shown as "—" — **confirm the correct values with the client**.

## Launch checklist (audited 12 Nov 2026)

**Basics — all passing**

| Item | Status |
|---|---|
| No horizontal scroll / mobile overflow | Checked at 375px on every route: `scrollWidth === clientWidth` everywhere |
| Broken links | Crawled all 22 internal URLs: all 200. Old misspelled slugs redirect. External links respond |
| Mobile menu | Slide-in drawer with grouped sections, `aria-expanded`, `inert` when closed |
| Favicon | `src/app/icon.svg` (brand door mark); default Next favicon removed |
| Page titles / meta descriptions | Title template + per-page descriptions, Open Graph and Twitter cards, theme colour |
| Footer links | All resolve; products list generated from data |
| Custom 404 | `src/app/not-found.tsx` |
| Copyright year | Dynamic |
| Images | Served through `next/image` (resized, WebP/AVIF, lazy, `sizes` set). Copy originals locally before launch |
| Buttons / CTAs | All link or submit; checked by crawl + manual pass |
| Form success / error states | Inline success pill, server error pill, per-field validation messages with `aria-invalid` / `role="alert"` |
| Placeholder text | None in copy. Social URLs are still generic (client to supply real profiles) |
| Logo / phone / email clickable | Yes (`/`, `tel:`, `mailto:`) |

**Features — added because they help this site**

Site search (⌘/Ctrl+K, static index of pages, products, projects, FAQs) · floating contact speed-dial (WhatsApp / call / email) · back-to-top · copy buttons for phone, email and addresses · UTM capture (stored for the session, sent with enquiries) · skip-to-content link · print stylesheet · route loading state · "Last updated" build date in footer · scroll progress bar · sticky header · hover states · expandable FAQ · loading/reveal animations.

**Features — deliberately not added**

Dark mode toggle (brand palette is intentionally light + navy; a second theme would double design QA for little gain) · cookie banner (the site sets no tracking cookies, so a banner would be misleading; add one only if analytics are introduced) · password visibility toggle and confirmation modals (no accounts or destructive actions).

**Accessibility**

Skip link, landmarks, one H1 per page, labelled controls, keyboard-reachable dropdowns (`focus-within`), focus rings, `prefers-reduced-motion` honoured by Lenis, CSS animations and Motion (`MotionConfig reducedMotion="user"`), text contrast raised on gold eyebrows and muted copy, 3D canvas exposed as a labelled image.

**Performance**

Static generation for every page, `next/image` everywhere, fonts via `next/font` with `display: swap`, 3D door loaded client-side only, DPR capped at 1.5, no shadow maps, rendering paused when off screen, grain overlay without blend mode.

## Round 3 additions (12 Nov 2026)

- **Key features** is a pinned scroll story: when the section reaches the header it locks in place, the four steps reveal one by one as you scroll (80svh of scroll each), and the Three.js scene (`src/components/three/FeatureScene.tsx`) switches stage to match (coating layers, glazing configurator, rain/shield durability test, delivery truck). After step four the page scrolls on normally. Step markers jump to a step. Viewports shorter than 540px fall back to a normal stacked layout. Drag to orbit; it pauses when off-screen.
- **Image viewer** (`Lightbox.tsx`) supports swipe/drag left and right with a slide transition, plus buttons and arrow keys.
- **Working areas** is an animated SVG network map (`src/components/WorkingAreas.tsx`): plants in Nashik and Jalgaon, routes drawn to six cities with travelling pulses, hover/focus a city chip to highlight its routes, plus a compact client-logo strip with lightbox.
- **No page loads on filters**: gallery categories and project stages are client-side (`GalleryBrowser.tsx`, `ProjectsBrowser.tsx`) and update the URL and tab title with `history.replaceState`. The static routes still exist for SEO. `loading.tsx` was removed and the route fade shortened.
- **SEO**: `sitemap.ts`, `robots.ts`, canonical URLs on every page, Open Graph images on products, and JSON-LD (Organization/LocalBusiness + WebSite in the layout, FAQPage on home, Product + BreadcrumbList on product pages, BreadcrumbList on gallery/projects). Builders live in `src/lib/seo.tsx`.
- **Page headers** got a right-hand "At a glance" panel (established, plants, experience centres, call/WhatsApp/quote) and a rotating badge, so the breadcrumb band no longer has dead space. Pages can pass `aside` to override it.
- **Cursor**: buttons, tabs and summaries show a pointer again (Tailwind v4 preflight resets them), and a soft trailing ring (`CustomCursor.tsx`) reacts to interactive elements with "View"/"Drag" labels. Fine pointers only; disabled for reduced motion.
- **Equal-height cards** across product, project and sub-product grids (staggered offsets removed, TiltCard wrapper stretches).
- **Layout shift**: counters reserve their final width, feature captions/legends no longer collapse between steps, 3D canvases have fixed heights. Measured CLS while scrolling the full home page: 0.
- Section spacing tightened (`py-16 lg:py-24`), hero no longer forces full viewport height on phones.

## Deploying to GitHub Pages

`npm run deploy:pages` builds a static export and force-pushes it to the `gh-pages` branch, which GitHub Pages serves at `https://<owner>.github.io/<repo>/` (Settings, Pages: deploy from branch `gh-pages`, folder `/`). Run it again after every change you want the client to see.

- `GITHUB_PAGES=true` switches `next.config.ts` to `output: "export"`, adds the `/<repo>` base path and trailing slashes, and turns off image optimisation and redirects (both need a server).
- `scripts/flatten-segments.mjs` runs after the build so client-side prefetch files resolve on a static host.
- The preview is built with `NEXT_PUBLIC_NOINDEX=1` (robots `Disallow: /` and `noindex` meta) so it never competes with the real domain in search.
- **Contact form:** there is no server on Pages, so the form opens the visitor's email app pre-filled to the business address. To receive submissions directly, create a form endpoint (Formspree, Web3Forms, Getform) and deploy with `FORM_ENDPOINT=<url> npm run deploy:pages`.
- GitHub's free plan only serves Pages from **public** repositories.
- Auto-deploy on every push needs a GitHub Actions workflow; pushing one requires the `workflow` token scope (`gh auth refresh -s workflow`).

## 3D scenes (13 Nov 2026)

| Where | Scene | File |
| --- | --- | --- |
| Home hero | French door that opens on hover/scroll | `three/DoorScene.tsx` |
| Home, Key Features | Pinned scroll story, four stages | `three/FeatureScene.tsx` |
| Every product page | Interactive viewer: orbit, six finish previews, open/close. One procedural model per range (side panels, arch, grill, sill, bench, XXL with a scale figure) | `ProductViewer.tsx`, `three/ProductScene.tsx`, `three/productModels.ts` |
| About | Pinned scroll story: a door assembles itself (frame, leaves, glazing, hardware) | `DoorAssembly.tsx`, `three/AssemblyScene.tsx` |
| CTA banner (all pages, large screens) | Gold infinity emblem with drifting glass panes | `SceneSlots.tsx`, `three/InfinityScene.tsx` |
| 404 | The hero door standing ajar | `SceneSlots.tsx` |

Shared rules for all of them:

- **Loaded late, paused early.** `useNear` mounts a scene (and downloads three.js) only when it is within 400px of the viewport; the canvas stops rendering frames when it scrolls off screen.
- **Pinned scroll stories behave the same.** Key Features and the door assembly both use `.pin-track` / `.pin-frame` and the constants in `usePinned.ts`: 80svh of scroll per step, the same spring, the same step dots/counter, click-to-jump landing 40% into a step, and a stacked fallback under 540px viewport height.
- **Touch.** `.scene-pan-y` lets a vertical swipe over any canvas scroll the page; horizontal drags rotate the model.
- New product range? Add an entry to `productModels` keyed by the product slug.
- Finish colours in the viewer are illustrative previews, not a confirmed shade card.
