// Runs after `vite build`. Visits every public route with Puppeteer,
// waits for react-helmet-async to finish writing <head>, and saves the
// fully rendered HTML into dist/<route>/index.html.
import puppeteer from "puppeteer";
import { createServer } from "vite";
import fs from "fs";
import path from "path";

const ROUTES = [
  "/",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/api-docs",
  "/integrations",
  "/pricing",
  "/property-intel",
  "/solutions/brokers",
  "/solutions/buyers-agents",
  "/solutions/lenders",
  "/solutions/legal"
];

async function run() {
  const server = await createServer({
    root: process.cwd(),
    server: { port: 5099 },
    preview: { port: 5099 },
  });
  const preview = await server.listen(5099);
  const base = "http://localhost:5099";

  const browser = await puppeteer.launch({ headless: "new" });
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
  await preview.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
