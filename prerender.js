// Runs after `vite build`. Visits every public route with Puppeteer,
// waits for react-helmet-async to finish writing <head>, and saves the
// fully rendered HTML into dist/<route>/index.html.
//
// Uses @sparticuz/chromium on Vercel (its build sandbox lacks system
// libraries for full Puppeteer's bundled Chrome) and falls back to a
// normal local Chrome/Chromium install elsewhere (e.g. Render, your machine).
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { preview } from "vite";
import fs from "fs";
import path from "path";

const ROUTES = [
  "/", "/about", "/blog", "/careers", "/contact", "/privacy", "/terms",
  "/cookies", "/api-docs", "/integrations", "/pricing", "/property-intel",
  "/solutions/brokers", "/solutions/buyers-agents", "/solutions/lenders",
  "/solutions/legal",
];

// Pages should be considered "ready" once the DOM (and react-helmet-async's
// head tags) have been written — not once the network has fully gone idle.
// Some pages fire live API calls on mount (e.g. /pricing), and that backend
// usually isn't running at all during a build. Waiting on `networkidle0`
// there means a single dead/unreachable request can stall the whole build
// until Puppeteer's own timeout fires.
const NAV_TIMEOUT_MS = 30000;

const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

function resolveLocalChromePath() {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;
  const candidates = ["/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium"];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    throw new Error(
      `No Chrome/Chromium executable found. Checked: ${candidates.join(", ")}. ` +
      `Set CHROME_EXECUTABLE_PATH to point at your installed browser.`
    );
  }
  return found;
}

async function launchBrowser() {
  if (isServerless) {
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  // Local/Render: use whatever Chrome/Chromium is installed on the system.
  return puppeteerCore.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: resolveLocalChromePath(),
  });
}

async function run() {
  const server = await preview({
    root: process.cwd(),
    preview: { port: 5099 },
  });
  const base = `http://localhost:${server.config.preview.port}`;

  const browser = await launchBrowser();
  const page = await browser.newPage();

  page.on("pageerror", (err) => {
    console.warn(`  [pageerror] ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") console.warn(`  [console.error] ${msg.text()}`);
  });

  for (const route of ROUTES) {
    const url = `${base}${route}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.waitForSelector("title", { timeout: NAV_TIMEOUT_MS });
      const html = await page.content();

      const outDir = route === "/" ? "dist" : path.join("dist", route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      console.log(`Prerendered ${route} -> ${outDir}/index.html`);
    } catch (err) {
      await browser.close();
      server.httpServer.close();
      throw new Error(`Failed to prerender ${route}: ${err.message}`);
    }
  }

  await browser.close();
  server.httpServer.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});