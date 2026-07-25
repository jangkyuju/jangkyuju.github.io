import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const config = read("_config.yml");
const googleTag = read("_includes/analytics/google.html");
const tracker = read("_includes/google-analytics.html");
const contact = read("_layouts/contact.html");
const analyticsLayout = read("_layouts/analytics.html");

const sourceFiles = [
  "_includes/custom-topbar.html",
  "_includes/custom-footer.html",
  "_layouts/home.html",
  "_layouts/publications.html",
  "_layouts/projects.html",
  "_layouts/contact.html",
  "_layouts/cv.html",
  "_layouts/analytics.html",
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const [name, source] of [
  ["GA4 tag", googleTag],
  ["portfolio tracker", tracker],
]) {
  const script = Array.from(
    source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g),
    (match) => match[1],
  ).find((body) => body.trim());
  check(Boolean(script), `${name} inline script is missing.`);
  if (script) {
    try {
      // Compile only; browser globals are intentionally not executed here.
      new Function(script);
    } catch (error) {
      failures.push(`${name} has invalid JavaScript: ${error.message}`);
    }
  }
}

check(/id:\s*"G-[A-Z0-9]+"/.test(config), "GA4 measurement ID is missing.");
check(
  /dashboard_url:\s*"https:\/\/datastudio\.google\.com\/embed\/reporting\//.test(
    config,
  ),
  "Looker Studio embed URL is missing or unexpected.",
);
check(
  googleTag.includes("window.gtag = window.gtag || function()"),
  "The GA4 tag must expose window.gtag for custom events.",
);
check(
  googleTag.includes("allow_google_signals: false") &&
    googleTag.includes("allow_ad_personalization_signals: false"),
  "Privacy-focused GA4 configuration is incomplete.",
);
check(
  !tracker.includes("link_url:") && !tracker.includes("link_text:"),
  "The tracker must not send full link URLs or link text.",
);
check(
  tracker.includes("link.protocol !== 'mailto:'"),
  "Email destinations must be excluded from destination_host collection.",
);
check(
  contact.includes("trackPortfolioEvent('contact_intent'"),
  "The contact form is missing contact_intent tracking.",
);
check(
  analyticsLayout.includes('data-analytics-event="dashboard_open"'),
  "The full dashboard link is missing analytics tracking.",
);

const eventNames = [];
for (const relativePath of sourceFiles) {
  const source = read(relativePath);
  for (const match of source.matchAll(/data-analytics-event="([^"]+)"/g)) {
    eventNames.push({ eventName: match[1], relativePath });
  }
}

for (const { eventName, relativePath } of eventNames) {
  check(
    /^[a-z][a-z0-9_]{0,39}$/.test(eventName),
    `Invalid GA4 event name "${eventName}" in ${relativePath}.`,
  );
}

for (const requiredEvent of [
  "cv_download",
  "email_click",
  "publication_paper_click",
  "dashboard_open",
]) {
  check(
    eventNames.some(({ eventName }) => eventName === requiredEvent),
    `Required event "${requiredEvent}" is not attached to a link.`,
  );
}

if (failures.length > 0) {
  console.error("Analytics checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Analytics checks passed (${eventNames.length} tracked links, ${new Set(eventNames.map(({ eventName }) => eventName)).size} event names).`,
);
