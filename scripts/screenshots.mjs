// Regenerates the README screenshots in docs/screenshots/.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const server = await serve();
const url = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2 });
const out = (name) => new URL(`../docs/screenshots/${name}`, import.meta.url).pathname;

await page.goto(url);
await page.locator('#mPlay').waitFor();
await page.waitForTimeout(600);
await page.screenshot({ path: out('menu.png') });

await page.click('#mPlay');
await page.waitForTimeout(400);
await page.screenshot({ path: out('level-intro.png') });

await page.click('#ovBtn');
const box = await page.locator('canvas').first().boundingBox();
for (const fx of [0.25, 0.5, 0.75]) {
  await page.mouse.click(box.x + box.width * fx, box.y + box.height * 0.08);
  await page.waitForTimeout(700);
}
await page.waitForTimeout(2500);
await page.screenshot({ path: out('gameplay.png') });

await browser.close();
server.close();
