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
  for (const [width, height] of [[1280,720]]) {
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
      const { createGame, startAction, canEarlyRaid } = await import('/src/engine.js?v=0.6.140');
      const { writeStoredGame } = await import('/src/save-storage.js?v=0.6.140');
      const game = createGame();
      game.meta.bestWave = 12;
      for (let wave = 6; wave <= 12; wave++) {
        game.run.wave = wave;
        if (canEarlyRaid(game).ok) break;
      }
      if (!canEarlyRaid(game).ok) throw Error('Could not create a wave with manual raid enabled');
      startAction(game, 'chop_wood');
      game.run.activeAction.progress = game.run.activeAction.duration * 0.4;
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
    await page.screenshot({ path: 'evidence/' + prefix + '-supplemental.png' });
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
    await page.locator("#info-dialog [data-close]").first().click();
    const layout = await page.evaluate(() => {
      const bar = document.querySelector('[data-live-work]');
      const goals = document.querySelector('.useful-goals');
      const early = document.querySelector('[data-command="early-raid-menu"]');
      const content = document.querySelector('#content');
      return {
        bar: getComputedStyle(bar).backgroundColor,
        width: bar.getBoundingClientRect().width,
        goalsBeforeCards: goals.getBoundingClientRect().top < content.getBoundingClientRect().top,
        earlyBeforeCards: early.getBoundingClientRect().top < content.getBoundingClientRect().top,
      };
    });
    console.log(prefix, layout);
    assert(layout.width > 0);
    if (stage !== 'before') assert.equal(layout.bar, 'rgb(86, 214, 198)');
    assert(layout.goalsBeforeCards && layout.earlyBeforeCards, 'Supplemental controls should precede cards');
    await page.locator('.useful-goals summary').click();
    const goalsScroll = await page.locator('#useful-goals').evaluate(host => {
      const candidates = [host, host.querySelector('.useful-goals')];
      return candidates.map(el => ({
        maxHeight: getComputedStyle(el).maxHeight,
        overflow: getComputedStyle(el).overflowY,
        height: el.clientHeight,
        contentHeight: el.scrollHeight
      }));
    });
    console.log('expanded goals sizing', goalsScroll);
    if (stage !== 'before') assert(goalsScroll.some(el => el.maxHeight !== 'none' && ['auto','scroll'].includes(el.overflow)), 'Expanded goals require a capped scroller');
    await page.screenshot({ path: 'evidence/' + prefix + '-goals-open.png' });
    await page.locator('.useful-goal [data-tab]').first().click({ trial: true, timeout: 5000 });
    await page.locator('[data-command="early-raid-menu"]').click({ trial: true, timeout: 5000 });
    await page.locator('.gather-card button[data-action]').first().click({ trial: true, timeout: 5000 });
    assert.deepEqual(errors, []);
    results.push({ prefix, ...result, queueKeyboard: true, countEdited: true });
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile('evidence/' + stage + '-supplemental-layout.json', JSON.stringify(results, null, 2));
}
console.log(results.map(({ prefix, horizontalOverflow, queueKeyboard, countEdited }) => ({ prefix, horizontalOverflow, queueKeyboard, countEdited })));