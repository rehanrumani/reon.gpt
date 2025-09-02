#!/usr/bin/env node
/**
 * ReonGPT Health Check
 * - Verifies env vars (OPENAI_API_KEY)
 * - Verifies required dependencies are installed
 * - Verifies key files exist
 * - Sanity checks Tailwind & PostCSS configs
 *
 * Exits with code 1 on failure to block CI/CD builds.
 */

const fs = require("fs");
const path = require("path");

let hasErrors = false;
const ok = (m) => console.log(`✅ ${m}`);
const warn = (m) => console.warn(`⚠️  ${m}`);
const err = (m) => { console.error(`❌ ${m}`); hasErrors = true; };

const mustExist = (p, label = p) => {
  const full = path.resolve(p);
  if (!fs.existsSync(full)) err(`Missing: ${p}`);
  else ok(`Found ${label}`);
};

const pkgHas = (dep) => {
  try {
    require.resolve(`${dep}/package.json`, { paths: [process.cwd()] });
    ok(`Dependency installed: ${dep}`);
  } catch {
    err(`Missing dependency: ${dep}  →  install with: npm i ${dep}`);
  }
};

console.log("\n🔎 Running ReonGPT Health Check...\n");

// 1) ENV
const requiredEnv = ["OPENAI_API_KEY"];
requiredEnv.forEach((k) => {
  if (!process.env[k]) {
    warn(
      `Env ${k} is not set in this shell.\n` +
      `   • On Vercel, add it in Project → Settings → Environment Variables\n` +
      `   • Locally, add it to a .env file (OPENAI_API_KEY=...)`
    );
  } else {
    ok(`Env present: ${k}`);
  }
});

// 2) Dependencies
[
  "next",
  "react",
  "react-dom",
  "framer-motion",
  "lucide-react",
  "tailwindcss",
  "postcss",
  "autoprefixer",
].forEach(pkgHas);

// 3) Critical files
[
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "app/api/chat/route.ts",
  "app/components/Header.tsx",
  "app/components/ChatContainer.tsx",
  "app/components/ChatMessage.tsx",
  "app/components/TypingIndicator.tsx",
  "app/components/MessageInput.tsx",
].forEach((f) => mustExist(f));

// 4) Configs
const tailwindCandidates = [
  "tailwind.config.js",
  "tailwind.config.cjs",
  "tailwind.config.mjs",
];
const postcssCandidates = [
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.mjs",
];

const foundTailwind = tailwindCandidates.find((f) =>
  fs.existsSync(path.resolve(f))
);
const foundPostcss = postcssCandidates.find((f) =>
  fs.existsSync(path.resolve(f))
);

if (!foundTailwind) {
  err("Missing Tailwind config (tailwind.config.js/cjs/mjs).");
} else {
  ok(`Found ${foundTailwind}`);
  try {
    const txt = fs.readFileSync(foundTailwind, "utf8");
    const hasAppGlob =
      txt.includes("./app/**/*.{ts,tsx}") ||
      /content\s*:\s*\[[^\]]*app\/\*\*.*\{ts,tsx\}/s.test(txt);
    if (!hasAppGlob) {
      warn(
        `Tailwind "content" should include "./app/**/*.{ts,tsx}" in ${foundTailwind}.`
      );
    } else {
      ok('Tailwind "content" includes "./app/**/*.{ts,tsx}".');
    }
  } catch (e) {
    warn(`Could not read ${foundTailwind}: ${e.message}`);
  }
}

if (!foundPostcss) {
  err("Missing PostCSS config (postcss.config.js/cjs/mjs).");
} else {
  ok(`Found ${foundPostcss}`);
}

// Finalize
if (hasErrors) {
  console.error(
    "\n❌ Health check failed. Fix the items above, then rerun: npm run check\n"
  );
  process.exit(1);
} else {
  console.log("\n✨ Health check passed.\n");
}
