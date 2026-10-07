/**
 * Visual QA: takes screenshots of the running site with your installed Chrome.
 *
 *   npm run dev                              (in another terminal)
 *   node scripts/shoot.mjs shots.json        (see the example spec below)
 *
 * Spec: [{ "path": "/", "out": "home.png", "w": 1440, "h": 900,
 *          "scroll": "#pricing" | 1200, "wait": 1200, "full": false,
 *          "reduced": false, "dpr": 1,
 *          "actions": [{ "click": "css" }, { "type": ["#id", "text"] }, { "wait": 500 }, { "hover": "css" }] }]
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => fs.existsSync(p));

const BASE = process.env.BASE_URL || "http://localhost:5173";
const specPath = process.argv[2];
const outDir = process.argv[3] || "shots";
if (!specPath) {
  console.error("usage: node scripts/shoot.mjs <spec.json> [outDir]");
  process.exit(1);
}
const shots = JSON.parse(fs.readFileSync(specPath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--force-color-profile=srgb"],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const s of shots) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error(`[pageerror] ${s.out}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") console.error(`[console.${m.type()}] ${s.out}: ${m.text()}`);
  });
  await page.setViewport({ width: s.w ?? 1440, height: s.h ?? 900, deviceScaleFactor: s.dpr ?? 1, isMobile: !!s.mobile, hasTouch: !!s.mobile });
  if (s.reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE + (s.path ?? "/"), { waitUntil: "networkidle0", timeout: 60000 });
  await sleep(s.initialWait ?? 1800);

  if (s.scroll !== undefined) {
    await page.evaluate(async (target) => {
      const y =
        typeof target === "number" ? target : (document.querySelector(target)?.getBoundingClientRect().top ?? 0) + window.scrollY - 0;
      // Step down the page so in-view animations along the way fire naturally.
      const steps = 12;
      const start = window.scrollY;
      for (let i = 1; i <= steps; i++) {
        window.scrollTo(0, start + ((y - start) * i) / steps);
        await new Promise((r) => setTimeout(r, 60));
      }
    }, s.scroll);
  }

  for (const a of s.actions ?? []) {
    if (a.click) {
      await page.click(a.click);
    } else if (a.type) {
      await page.click(a.type[0], { clickCount: 3 });
      await page.type(a.type[0], a.type[1], { delay: 20 });
    } else if (a.hover) {
      await page.hover(a.hover);
    } else if (a.eval) {
      await page.evaluate(a.eval);
    } else if (a.wait) {
      await sleep(a.wait);
    }
  }

  await sleep(s.wait ?? 1400);
  const file = path.join(outDir, s.out);
  await page.screenshot({ path: file, fullPage: !!s.full, type: file.endsWith(".jpg") ? "jpeg" : "png", quality: file.endsWith(".jpg") ? 82 : undefined });
  console.log("saved", file);
  await page.close();
}

await browser.close();
