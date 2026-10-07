# Xhibit AI — website

The marketing site for **Xhibit AI**, plus a small API that stores enquiries.
One job: turn visitors (restaurant owners, clinic managers, school offices…) into conversations on WhatsApp.

```
site.config.ts      ← YOUR DETAILS: phone, WhatsApp, booking link, prices, promises, founders
src/                ← React + Tailwind + Motion frontend
  content/          ← all copy: industries, FAQs, chat scripts (edit text here)
  demos/            ← the 8 live demo websites shown inside phones/laptops
public/demos/       ← demo photos (swap with real client photos later)
server/             ← FastAPI + Postgres API for enquiries and events
scripts/            ← image download, share images, screenshots, accessibility audit
```

---

## 1. Run it locally

**Frontend** (Node 22.22+ recommended):

```bash
npm install
npm run dev            # http://localhost:5173  (Vite picks the next free port if busy)
```

**API + Postgres** (Docker Desktop):

```bash
docker compose up --build        # API on http://localhost:8010, docs at /api/docs
```

The dev server forwards `/api/*` to `http://127.0.0.1:8010`. Different port? `API_PROXY_TARGET=http://127.0.0.1:9000 npm run dev`.

Without Docker, run the API on SQLite:

```bash
cd server
python -m venv .venv && .venv\Scripts\activate      # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
copy .env.example .env                                # then fill in ADMIN_TOKEN
uvicorn app.main:app --reload --port 8010
pytest -q                                             # 11 tests
```

---

## 2. Before you go live — edit `site.config.ts`

Everything visitors see about *you* lives in that one file. Search it for `TODO`:

- [ ] **Phone + WhatsApp number** — `whatsapp` is digits only with country code, e.g. `919876543210`
- [ ] **Booking link** — a Cal.com / Calendly link for a free 20-minute call
- [ ] **Domain** (`brand.url`) — used for SEO tags, the sitemap and share links
- [ ] **Prices** — the three plans and the care plan are placeholders
- [ ] **Promises** — keep only the ones you can *always* honour
- [ ] **Founding offer** — update `spotsTaken` honestly as you sign clients
- [ ] **Founders** — add real names, roles and photos (put photos in `public/team/`). Real faces are your strongest trust signal.
- [ ] **Socials** — empty links stay hidden

Then: `npm run og` (with the dev server running) to refresh the share images, and have the privacy page (`src/pages/PrivacyPage.tsx`) reviewed.

While the placeholder number is still in place, the dev server shows a small reminder in the corner.

---

## 3. Your best sales tool: personalised demo links

Every industry demo accepts the prospect's name:

```
https://xhibitai.in/for/restaurants?name=Kesar%20Kitchen&area=Lalpur
https://xhibitai.in/for/clinics?name=Sharma%20Dental
```

Open it on your phone across the counter, or send it on WhatsApp. They see **their own business** on a finished-looking website, and the link preview shows that industry's own image and headline. The **"Copy personalised link"** button on each demo page builds these for you.

Industry pages: `restaurants`, `clinics`, `schools`, `salons`, `gyms`, `hotels`, `retail`, `business`.

---

## 4. Leads: where they go

1. **WhatsApp** (most leads). Every button sends a pre-filled message saying what they looked at, e.g. *"I run Arogya Clinic, a clinic in Ranchi. I saw your clinic demo…"*.
2. **The form** saves to Postgres. If the API is ever down, the form offers to send the same details on WhatsApp, so no lead is lost.
3. **Instant alert**: set `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (or `NOTIFY_WEBHOOK_URL`) in `server/.env` and every enquiry pings your phone. Reply fast — it matters.

**Admin** (send `Authorization: Bearer <ADMIN_TOKEN>`, or use the "Authorize" button at `/api/docs`):

| | |
|---|---|
| `GET /api/admin/enquiries?status=new` | list leads |
| `PATCH /api/admin/enquiries/{id}` | `{"status": "contacted", "notes": "…"}` |
| `GET /api/admin/enquiries.csv` | export for Excel / Google Sheets |
| `GET /api/admin/stats` | leads per industry + which demos people open |

Event tracking (WhatsApp/call taps, demo views) is first-party only, with no third-party trackers. It's off in development unless you set `VITE_TRACK_DEV=1`.

---

## 5. Deploy

**Frontend** is static: `npm run build` → upload `dist/` to Netlify, Vercel or Cloudflare Pages.
`dist/` contains a separate HTML file per industry page with its own title and share image (WhatsApp and Facebook previews need this). `public/_redirects` handles the rest on Netlify.

**API**: any host that runs Docker or Python (Render, Railway, Fly.io, a small VPS) plus managed Postgres. Set:

```
DATABASE_URL=postgresql://…
ALLOWED_ORIGINS=https://xhibitai.in,https://www.xhibitai.in
ADMIN_TOKEN=<long random string>
IP_HASH_SALT=<random string>
```

If the API lives on another domain (e.g. `api.xhibitai.in`), build the frontend with `VITE_API_URL=https://api.xhibitai.in npm run build`. The simplest setup serves both from the same domain with `/api` proxied to the API.

---

## 6. Changing things

| To change… | Edit |
|---|---|
| Contact details, prices, promises, offer | `site.config.ts` |
| Industry copy, features, FAQs, automations | `src/content/industries.ts` |
| Home FAQs, AI chat scripts, process steps | `src/content/home.ts` |
| A demo website | `src/demos/<industry>/…` |
| Demo photos | `scripts/demo-images.json` → `npm run images`, or drop files into `public/demos/<industry>/` |
| Colours, fonts, motion | `src/index.css` (see `DESIGN.md`) |

**Quality checks** (dev server running): `node scripts/a11y.mjs` (WCAG 2.2 AA audit, currently 0 violations) and `node scripts/shoot.mjs <spec.json>` (screenshots).

---

## Notes

- Demo photos are from Unsplash (free licence, credits in `public/demos/CREDITS.md`). Replace them with your clients' real photos as you go.
- English only for now. All copy lives in `src/content/` and `site.config.ts`, so adding Hindi later is a content job, not a rebuild.
- The hero's moving "silk" uses WebGL on desktops only. Phones and reduced-motion users get a soft CSS gradient.
