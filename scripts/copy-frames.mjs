// Copies the faded Blender render (blender/render-faded/spin_0001.webp …) into public/glass/01.webp …
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const src = "blender/render-faded";
const dest = "public/glass";
mkdirSync(dest, { recursive: true });

const frames = readdirSync(src).filter((f) => /^spin_\d{4}\.webp$/.test(f)).sort();
for (const f of frames) {
  const n = Number(f.slice(5, 9));
  copyFileSync(join(src, f), join(dest, `${String(n).padStart(2, "0")}.webp`));
}
console.log(`copied ${frames.length} frames to ${dest}`);
