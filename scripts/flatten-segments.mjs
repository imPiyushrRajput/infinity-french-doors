// Static-export fix-up for client-side prefetching.
//
// `next build` with output: "export" writes per-segment prefetch data as nested files,
//   out/products/safety-doors/__next.products/$d$slug/__PAGE__.txt
// but the router requests the flattened name,
//   out/products/safety-doors/__next.products.$d$slug.__PAGE__.txt
// Static hosts (GitHub Pages) then answer 404. This copies every nested segment file
// to its flattened name so prefetches resolve. Usage: node scripts/flatten-segments.mjs out
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
let copied = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) flatten(dir, full, [entry.name]);
    else if (entry.name !== "_next") walk(full);
  }
}

function flatten(pageDir, dir, parts) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      flatten(pageDir, full, [...parts, entry.name]);
    } else {
      const target = path.join(pageDir, [...parts, entry.name].join("."));
      if (!fs.existsSync(target)) {
        fs.copyFileSync(full, target);
        copied++;
      }
    }
  }
}

walk(root);
console.log(`flatten-segments: wrote ${copied} prefetch files in ${path.relative(process.cwd(), root) || "."}`);
