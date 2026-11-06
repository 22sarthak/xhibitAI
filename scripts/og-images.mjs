/**
 * Renders the social share images (1200×630) and app icons into public/.
 *
 *   npm run dev            (in another terminal)
 *   npm run og             (or: BASE_URL=http://localhost:5174 npm run og)
 *
 * Re-run whenever you change headlines, colours or the logo (after `npm run logo`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL || "http://localhost:5173";
const CHROME =
  process.env.CHROME_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => fs.existsSync(p));

const slugs = [
  "home", "restaurants", "clinics", "schools", "salons", "gyms", "hotels", "retail", "business",
  "service-websites", "service-landing-pages", "service-web-apps", "service-online-stores", "service-ai-automation",
];
const outDir = path.join(root, "public", "og");
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

for (const slug of slugs) {
  await page.goto(`${BASE}/og/${slug}`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 900));
  const el = await page.$("#og");
  const png = await el.screenshot({ type: "png" });
  // JPEG keeps it well under WhatsApp's ~300 KB preview limit.
  await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, `${slug}.jpg`));
  console.log("og:", slug);
}
await browser.close();

// The iPhone home-screen icon (apple-touch-icon.png) is made by `npm run logo`.
