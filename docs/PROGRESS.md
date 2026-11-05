# Progress log

Newest first. The plan and decisions live in [PLAN.md](PLAN.md).

## 2026-11-06

**Brand and content**
- Contact details are live in `site.config.ts`: WhatsApp +91 92639 30093, phone +91 88093 87090, contact.xhibitai@gmail.com. Location is Bengaluru (footer, privacy page, search data only).
- Removed: Pricing section and nav link, founding offer, prices in FAQs and industry pages, in-person visit promises, "live in 7 days", founders block, every dev note and the placeholder banner.
- Hero headline is now "Your *restaurant*, made to be seen." (word still rotates per industry). Trust row: see your design before you pay · live in days, not months · replies within 2 hours.
- Approved motto, vision, mission and promises are in `site.config.ts` and shown in the footer and "Why Xhibit".
- No Ranchi framing outside the vision line and demo content. Industry SEO titles drop "in Ranchi"; structured data serves India.
- WhatsApp pre-filled messages no longer add a city.

**Design**
- Redaction replaces Fraunces everywhere (`@fontsource/redaction`); Fraunces uninstalled.
- New palette: porcelain background `#f5f5f2`, white cards, ink `#0b0b0c`, accents vermilion, cobalt, emerald, violet, saffron, rose. Each section number and italic accent has its own hue.
- Buttons are flatter (no glow shadows or hover lifts); WhatsApp buttons use a plain green glyph instead of a green disc.
- Hero: rotating badge moved to the phone's bottom-right corner (hidden on short screens where it would be clipped) and now reads the motto; nav CTA is "Start a project"; the floating WhatsApp button stays hidden until you scroll past the hero; the nudge appears once, on larger screens only, and hides itself after 8 seconds. No more pulsing rings or pinging dots.
- Strip under the hero: business types + "what we build" (no neighbourhoods, no X separators).
- Services bento rebuilt with real visuals: screenshots of our own demos (`public/showcase/`) and a real map. The AI assistant tile is a live WhatsApp chat that plays itself (a customer types, the assistant replies with slots, the customer taps one; it cycles clinic → restaurant in Hinglish → salon). The automations tile is a live iPhone lock screen where new notifications arrive and the clock ticks. Both are in `LiveVisuals.tsx`, run only while on screen, and stay still for reduced motion.
- Maps are real OpenStreetMap renders (`public/maps/`, rendered with OpenFreeMap, attributed).
- New "Our work" section: a CSS MacBook (with macOS menu bar and notch) running live demos, with the same site on an iPhone. Industry pages use the MacBook too.

**Demos**
- Each demo is set in a city (Bengaluru, Ranchi, Mumbai, Pune) and accepts `?city=` in personalised links; "Make it yours" has a city field.
- Gym hero: third-party "KINGS GYM" print retouched. Salon hero: swapped to a neutral salon interior. Biryani cut-out replaced. Menu shows as a two-column list on desktop (no empty cards). "Seekh kebab" renamed. Falls card retitled. Western yoga photo swapped for the unused training photo. Branded makeup photo removed.
- Deleted 10 unused or replaced photos and updated `scripts/demo-images.json` and `CREDITS.md`.
- Demo hero photos are preloaded with their code, so the hero phone no longer flashes grey.

**Checks**
- `npm run build` passes; accessibility audit: 0 violations on /, /for/restaurants, /privacy.
- Share images regenerated (`npm run og`).

**Later the same day**
- Hero badge moved to the phone's bottom-right corner.
- Live Services tiles (`LiveVisuals.tsx`): self-playing WhatsApp assistant chat and an iPhone lock screen receiving notifications.
- Phones: tighter hero spacing and compact promise row, so the live demo shows on the first screen (about 230px of it on a 390px-wide iPhone, up from 150px).
- "Try it yourself" has a Laptop / Phone switch (laptop by default on big screens). The laptop's address bar shows the visitor's own business name as a domain.
- Share images now show a MacBook with an iPhone in front, for the home page and all eight industries.
- Chat colours darkened for contrast. Build passes; accessibility audit: 0 violations.

**Now list complete.**

**Contact form**
- New optional fields: "What do you want to build?" (website, landing page, web app, online store, AI, not sure), city, and the visitor's rough budget band (under ₹25k up to above ₹2 lakh, or not sure). These are the visitor's budget, not our prices.
- The visible "What kind of business?" chips are gone; industry pages still send their industry automatically.
- Server stores `project_type`, `budget` and `city`, includes them in the Telegram alert and CSV export, and adds the columns to an existing database on start-up. Tested against a database with the old layout.
- API tests: 14 pass (3 new). Real submission through the form verified end to end.

**Service pages** (`/services/<slug>`)
- Five pages: Websites, Landing pages, Web apps & dashboards, Online stores, AI & automation. Content lives in `src/content/services.ts` (SEO titles in `service-meta.ts`).
- Each page: live MacBook + iPhone demo (AI page: the live WhatsApp chat and lock screen), what you get, who it's for, links to related live demos, how it works, promises, FAQs, contact form with that service already picked, links to the other services.
- Linked from the home Services section ("More about…" on tiles and an Explore row) and a new Services column in the footer.
- Each page has its own title, description, share image (`public/og/service-*.jpg`) and sitemap entry (15 URLs in total).
- The contact section only shows the "No. 09" marker on the home page now.
- Landing pages use the salon demo for now; it gets swapped once the startup landing page demo exists.
- Build passes; accessibility audit: 0 violations on home, all five service pages and /for/restaurants.

Next up: new demos (startup landing page, SaaS web app, AI tool).
