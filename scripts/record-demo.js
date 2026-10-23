// Records the content-script effect on a public tab; no user browser data is used.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

async function main() {
  const root = path.resolve(__dirname, "..");
  const videoDir = path.join(root, "demo-capture");
  fs.mkdirSync(videoDir, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "xolo-demo-"));
  const browser = await chromium.launch({
    executablePath: process.env.EDGE_EXE || chromium.executablePath(),
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
    reducedMotion: "no-preference",
  });
  try {
    const page = await context.newPage();
    const artData = `data:image/png;base64,${fs.readFileSync(path.join(root, "assets", "xolo-v1.png")).toString("base64")}`;
    await page.addInitScript(({ artData }) => {
      window.chrome = { runtime: { getURL: () => artData } };
    }, { artData });
    await page.goto("https://hackyard.tech/yards/yard-5", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.addScriptTag({ path: path.join(root, "haunt.js") });
    console.log("Invite:", await page.locator("#little-haunt-xolo-root").count());
    await page.waitForTimeout(9000);
    await page.addScriptTag({ path: path.join(root, "haunt.js") });
    console.log("Dismiss:", await page.locator("#little-haunt-xolo-root").count());
    await page.waitForTimeout(2000);
    const video = page.video();
    await context.close();
    await browser.close();
    console.log("Video:", await video.path());
  } finally {
    if (browser.isConnected()) await browser.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
