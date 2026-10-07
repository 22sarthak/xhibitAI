/**
 * Accessibility audit with axe-core (WCAG 2.2 A/AA) on the running site.
 *   npm run dev   then   node scripts/a11y.mjs [/path ...]
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = process.env.BASE_URL || "http://localhost:5173";
const CHROME =
  process.env.CHROME_PATH ||
  ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome"].find((p) =>
    fs.existsSync(p),
  );
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/for/restaurants", "/privacy"];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
let total = 0;
for (const p of paths) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  // Reduced motion so every scroll-reveal is already visible when axe looks at it.
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE + p, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(axeSource);
  const result = await page.evaluate(async () =>
    // eslint-disable-next-line no-undef
    axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } }),
  );
  console.log(`\n${p}: ${result.violations.length} violation types`);
  for (const v of result.violations) {
    total += v.nodes.length;
    console.log(`  [${v.impact}] ${v.id} (${v.nodes.length}) — ${v.help}`);
    for (const n of v.nodes.slice(0, 4)) console.log(`      ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
  }
  await page.close();
}
await browser.close();
console.log(`\nTotal failing nodes: ${total}`);
