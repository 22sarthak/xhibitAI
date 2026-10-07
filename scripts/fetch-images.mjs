/**
 * Downloads the demo photos (free Unsplash licence) into public/demos/<industry>/
 * as optimised WebP files and writes public/demos/CREDITS.md.
 *
 *   node scripts/fetch-images.mjs
 *
 * Swap any photo by changing its Unsplash photo id below (the part after
 * "photo-" in an images.unsplash.com URL, or use the full raw URL).
 * When you sign real clients, replace these with their own photos.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_KB = 150; // anything heavier is re-encoded more tightly

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const picks = JSON.parse(fs.readFileSync(path.join(root, "scripts", "demo-images.json"), "utf8"));

const credits = ["# Demo photo credits", "", "Demo photos are from [Unsplash](https://unsplash.com/license) (free to use, including commercially). Thank you to the photographers below.", ""];

for (const [slug, images] of Object.entries(picks)) {
  const dir = path.join(root, "public", "demos", slug);
  fs.mkdirSync(dir, { recursive: true });
  credits.push(`## ${slug}`, "");
  for (const img of images) {
    const out = path.join(dir, `${img.name}.webp`);
    const url = `${img.raw}?w=${img.w}&q=${img.q ?? 70}&fm=webp&fit=crop${img.h ? `&h=${img.h}` : ""}&crop=${img.crop ?? "entropy"}`;
    if (!fs.existsSync(out)) {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("FAILED", slug, img.name, res.status);
        continue;
      }
      fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    }
    if (fs.statSync(out).size > MAX_KB * 1024) {
      const smaller = await sharp(fs.readFileSync(out)).webp({ quality: 58, effort: 6, smartSubsample: true }).toBuffer();
      if (smaller.length < fs.statSync(out).size) fs.writeFileSync(out, smaller);
    }
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`${slug}/${img.name}.webp  ${kb} KB`);
    credits.push(`- \`${img.name}.webp\` — ${img.author ?? "Unknown"}${img.username ? ` ([@${img.username}](https://unsplash.com/@${img.username}))` : ""}`);
  }
  credits.push("");
}

fs.writeFileSync(path.join(root, "public", "demos", "CREDITS.md"), credits.join("\n"));
console.log("done");
