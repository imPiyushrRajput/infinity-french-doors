// Builds the static site and publishes it to the `gh-pages` branch of `origin`.
// GitHub Pages must be set to "Deploy from a branch: gh-pages / (root)".
// Usage: npm run deploy:pages            (set FORM_ENDPOINT=... to wire the contact form)
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const read = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const remote = read("git remote get-url origin");
const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/);
if (!match) throw new Error(`origin is not a GitHub repository: ${remote}`);
const [, owner, repo] = match;
const siteUrl = `https://${owner.toLowerCase()}.github.io/${repo}`;

console.log(`Building static export for ${siteUrl}/`);
fs.rmSync("out", { recursive: true, force: true });
run("npx next build", {
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    PAGES_REPO: repo,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    // Client preview: keep it out of search results so it never competes with the real domain.
    NEXT_PUBLIC_NOINDEX: "1",
    NEXT_PUBLIC_FORM_ENDPOINT: process.env.FORM_ENDPOINT ?? "",
  },
});
run("node scripts/flatten-segments.mjs out");
fs.writeFileSync(path.join("out", ".nojekyll"), "");

const sha = read("git rev-parse --short HEAD");
const opts = { cwd: "out" };
run("git init -q -b gh-pages", opts);
run("git add -A", opts);
run(`git -c user.name="${read("git config user.name")}" -c user.email="${read("git config user.email")}" commit -q -m "Deploy ${sha}"`, opts);
run(`git push -f "${remote}" gh-pages`, opts);
fs.rmSync(path.join("out", ".git"), { recursive: true, force: true });
console.log(`\nPublished. Live in about a minute at ${siteUrl}/`);
