import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const stage = process.argv[2];
const root = resolve(stage);
const origin = 'http://127.0.0.1:' + (stage === 'before' ? 43961 : 43962);
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
const contentTypes = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg'
};
await mkdir('evidence', { recursive: true });
try {
  for (const [width, height] of [[1280,720], [1920,1080], [390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, locale: 'ja-JP', reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      const file = resolve(root, url.pathname === '/' ? 'index.html' : '.' + decodeURIComponent(url.pathname));
      if (!file.startsWith(root + sep)) return route.abort();
      try {
        await route.fulfill({ path: file, contentType: contentTypes[extname(file)] });
      } catch {
        await route.fulfill({ status: 404, body: 'Not found' });
      }
    });
    await page.goto(origin);
    await page.evaluate(async () => {
      const { createGame, startAction } = await import('/src/engine.js?v=0.6.140');
      const { writeStoredGame } = await import('/src/save-storage.js?v=0.6.140');
      const game = createGame();
      game.meta.bestWave = 12;
      startAction(game, 'chop_wood');
      game.settings.paused = true;
      const jobs = ['chop_wood', 'quarry_stone', 'gather_food', 'chop_wood', 'quarry_stone'];
      game.run.queue = jobs.map((id, i) => ({ id, count: 2, kind: 'action', goalId: i + 1 }));
      game.run.queueSeq = jobs.length;
      if (!game.run.activeAction) throw Error('Work fixture could not start');
      writeStoredGame(localStorage, game);
    });
    await page.reload();
    await page.locator('[data-title-action="continue"]').click();
    await page.locator('.village-dashboard').waitFor();
    await page.locator('[data-village-work] button[data-tab="gather"], .village-dashboard [data-tab="gather"]').first().click();
    await page.locator('.gather-card').first().waitFor();
    await page.locator('#active-work .work-vignette').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const prefix = stage + '-' + width + 'x' + height;
    await page.screenshot({ path: 'evidence/' + prefix + '.png' });
    const result = await page.evaluate(() => {
      const selectors = ['.gather-card', '#active-work .work-vignette', '#queue-preview', '#queue-preview [data-focus="rail-editor"]', '#queue-preview li:first-child', '#mobile-queue-context'];
      const boxes = Object.fromEntries(selectors.map(selector => {
        const el = document.querySelector(selector);
        const box = el?.getBoundingClientRect();
        return [selector, box?.toJSON() ?? null];
      }));
      return { boxes, horizontalOverflow: document.documentElement.scrollWidth - innerWidth };
    });
    assert(result.horizontalOverflow <= 1, 'Horizontal overflow at ' + width);
    const edit = width >= 1000 ? page.locator('[data-focus="rail-editor"]') : page.locator('[data-camp-queue]:visible').first();
    await edit.focus();
    await edit.press('Enter');
    await page.locator('#info-dialog[open] .queue-box').waitFor();
    assert.equal(await page.locator('#info-dialog .queue-list li').count(), 5);
    const count = page.locator('#info-dialog [data-queue-count]').first();
    await count.fill('3');
    await count.press('Tab');
    assert.equal(await page.locator('#info-dialog [data-queue-count]').first().inputValue(), '3');
    assert.deepEqual(errors, []);
    results.push({ prefix, ...result, queueKeyboard: true, countEdited: true });
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile('evidence/' + stage + '-layout.json', JSON.stringify(results, null, 2));
}
console.log(results.map(({ prefix, horizontalOverflow, queueKeyboard, countEdited }) => ({ prefix, horizontalOverflow, queueKeyboard, countEdited })));