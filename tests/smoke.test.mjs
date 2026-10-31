// Smoke tests: the game loads cleanly, starts a level, installs as an app and runs offline.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { serve } from '../scripts/serve.mjs';

let server, browser, url;

before(async () => {
  server = await serve();
  url = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function openGame(context) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  return { page, errors };
}

test('menu loads with no errors and bundled fonts', async () => {
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
  const { page, errors } = await openGame(context);
  assert.equal(await page.title(), 'Marble Works');
  await page.locator('#mPlay').waitFor();
  assert.ok(await page.evaluate(() => document.fonts.load('700 20px Outfit').then(() => document.fonts.check('700 20px Outfit'))));
  assert.deepEqual(errors, []);
  await context.close();
});

test('a level starts and marbles can be poured', async () => {
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
  const { page, errors } = await openGame(context);
  await page.click('#mPlay');
  await page.click('#ovBtn');
  assert.equal(await page.locator('#overlay').isHidden(), true);
  const box = await page.locator('canvas').first().boundingBox();
  for (const fx of [0.25, 0.5, 0.75]) await page.mouse.click(box.x + box.width * fx, box.y + box.height * 0.08);
  await page.waitForTimeout(1500);
  assert.deepEqual(errors, []);
  await context.close();
});

test('every file the service worker caches exists, and the manifest icons resolve', async () => {
  const sw = await readFile(new URL('../web/sw.js', import.meta.url), 'utf8');
  const files = JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
  const manifest = JSON.parse(await readFile(new URL('../web/manifest.webmanifest', import.meta.url), 'utf8'));
  for (const f of [...files, ...manifest.icons.map((i) => i.src)]) {
    const res = await fetch(new URL(f, url));
    assert.equal(res.status, 200, `${f} should be served`);
  }
});

test('runs offline after the first visit', async () => {
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
  const { page } = await openGame(context);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(500);
  await context.setOffline(true);
  await page.reload();
  await page.locator('#mPlay').waitFor();
  assert.equal(await page.title(), 'Marble Works');
  await context.close();
});
