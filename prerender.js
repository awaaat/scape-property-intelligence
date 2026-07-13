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

const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

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
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      "/usr/bin/google-chrome" ||
      "/usr/bin/chromium-browser",
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

  for (const route of ROUTES) {
    const url = `${base}${route}`;
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.waitForSelector("title");
    const html = await page.content();

    const outDir = route === "/" ? "dist" : path.join("dist", route);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`Prerendered ${route} -> ${outDir}/index.html`);
  }

  await browser.close();
  server.httpServer.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
